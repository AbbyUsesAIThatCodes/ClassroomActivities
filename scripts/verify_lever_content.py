#!/usr/bin/env python3
"""Check the reviewed student selection; this does not establish authorship."""
import argparse
import hashlib
import json
from pathlib import Path
import struct
import sys
import zlib


def require(condition, message):
    if not condition:
        raise ValueError(message)


def keys(value, required, optional=()):
    require(isinstance(value, dict), 'Expected an object')
    actual = set(value)
    require(set(required) <= actual <= set(required) | set(optional),
            'Unexpected or missing student-content fields')


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def check_png(path):
    data = path.read_bytes()
    require(data[:8] == b'\x89PNG\r\n\x1a\n', 'Invalid PNG signature')
    cursor, chunks = 8, []
    while cursor < len(data):
        require(cursor + 12 <= len(data), 'Truncated PNG chunk')
        size = struct.unpack('>I', data[cursor:cursor + 4])[0]
        tag = data[cursor + 4:cursor + 8]
        end = cursor + size + 12
        require(end <= len(data), 'Truncated PNG data')
        require(tag in (b'IHDR', b'pHYs', b'IDAT', b'IEND'),
                'Unreviewed PNG metadata or chunk type')
        require(zlib.crc32(data[cursor + 4:end - 4]) ==
                struct.unpack('>I', data[end - 4:end])[0], 'PNG checksum mismatch')
        chunks.append(tag)
        cursor = end
        if tag == b'IEND':
            break
    require(cursor == len(data), 'Unexpected bytes after PNG end')
    require(chunks[0] == b'IHDR' and chunks[-1] == b'IEND' and b'IDAT' in chunks,
            'Incomplete PNG')


def verify(root):
    content = json.loads((root / 'student-content.json').read_text())
    inventory = json.loads((root / 'PROVENANCE.json').read_text())
    keys(content, ('content_format', 'activity_id', 'content_revision', 'title',
                   'authorship', 'introduction', 'parts', 'questions'))
    require(content['content_format'] == 'reviewed-student-content-v1', 'Unknown content format')
    require(content['activity_id'] == 'levers-load-effort-distance', 'Wrong activity')
    require(content['content_revision'] == 'C01', 'Unreviewed content revision')
    require(inventory['decision'] == 'selected-for-publication', 'Selection not approved')
    require(inventory['content']['path'] == 'student-content.json', 'Wrong content path')
    require(digest(root / 'student-content.json') == inventory['content']['sha256'],
            'Student content changed; review before updating the inventory')
    require(len(content['introduction']) == 6 and
            all(isinstance(t, str) and t for t in content['introduction']), 'Invalid introduction')
    require([p['questions'] for p in content['parts']] == [list(range(1, 9)), list(range(9, 15))],
            'Incorrect part membership')
    for number, part in enumerate(content['parts'], 1):
        keys(part, ('number', 'title', 'questions'))
        require(part['number'] == number, 'Incorrect part number')
    require(len(content['questions']) == len(inventory['questions']) == 14,
            'Question inventory is incomplete')
    require(len(inventory['assets']) == 14, 'Asset inventory is incomplete')
    ids, images, references = [], [], []
    predictions, sketches = 0, 0
    for number, (question, entry) in enumerate(zip(content['questions'], inventory['questions']), 1):
        keys(question, ('id', 'number', 'title', 'part', 'blocks'))
        require(question['id'] == entry['id'] == f'q{number}', 'Question ID mismatch')
        require(question['number'] == entry['number'] == number, 'Question order mismatch')
        require(question['part'] == (1 if number <= 8 else 2), 'Question part mismatch')
        require(entry['decision'] == 'selected-for-publication', 'Question not selected')
        require(entry['origin'] in inventory['origins'], 'Unknown question origin')
        question_ids, question_images = [], []
        for block in question['blocks']:
            kind = block.get('type')
            if kind == 'text':
                keys(block, ('type', 'text'))
            elif kind == 'field':
                keys(block, ('type', 'id', 'label', 'kind', 'purpose'), ('options',))
                require(block['kind'] in ('number', 'paragraph', 'choice'), 'Unknown field kind')
                require(block['purpose'] in ('prediction', 'response'), 'Unknown response purpose')
                require(('options' in block) == (block['kind'] == 'choice'), 'Invalid choice field')
                if 'options' in block:
                    require(isinstance(block['options'], list) and len(block['options']) >= 2 and
                            all(isinstance(t, str) for t in block['options']), 'Invalid choices')
                predictions += block['purpose'] == 'prediction'
                question_ids.append(block['id'])
            elif kind == 'sketch':
                keys(block, ('type', 'id', 'text'))
                sketches += 1
                question_ids.append(block['id'])
            elif kind == 'image':
                keys(block, ('type', 'src', 'alt'))
                require(block['src'] == f'assets/q{number:02d}.png', 'Unexpected asset path')
                require(bool(block['alt']), 'Missing image description')
                question_images.append(block['src'])
            elif kind == 'student-response-reference':
                keys(block, ('type', 'question_id', 'text'))
                references.append((question['id'], block['question_id']))
            else:
                raise ValueError('Unknown block type')
        require(question_ids == entry['response_ids'], 'Response inventory mismatch')
        require(len(question_images) == 1, 'Missing or duplicate question diagram')
        require(all(i.startswith(f'q{number}-') for i in question_ids), 'Response ID in wrong question')
        ids.extend(question_ids)
        images.extend(question_images)
    require(len(ids) == len(set(ids)) == 95, 'Incorrect or duplicate response IDs')
    require(predictions == 20 and sketches == 2, 'Prediction/sketch coverage mismatch')
    require(references == [('q11', 'q7')], 'Unexpected earlier-response reference')
    require([a['path'] for a in inventory['assets']] == images, 'Asset coverage mismatch')
    for number, entry in enumerate(inventory['assets'], 1):
        require(entry['question_id'] == f'q{number}', 'Asset assigned to wrong question')
        require(entry['decision'] == 'selected-for-publication' and
                entry['origin'] in inventory['origins'], 'Unreviewed asset')
        path = root / entry['path']
        require(not path.is_symlink(), 'Symlinks are not approved content')
        require(digest(path) == entry['sha256'], 'Image changed; review before updating the inventory')
        check_png(path)
    allowed = set(images) | {'README.md', 'student-content.json', 'PROVENANCE.json', 'THIRD_PARTY_NOTICES.md'}
    actual = {str(p.relative_to(root)) for p in root.rglob('*') if p.is_file() or p.is_symlink()}
    require(actual == allowed, 'Unexpected or missing files in the reviewed content directory')
    print('PASS: 14 questions, 95 controls, 20 predictions, 2 sketches, 14 PNGs; inventory and student-only fields verified.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--content-dir', type=Path,
                        default=Path(__file__).resolve().parents[1] / 'content/levers')
    args = parser.parse_args()
    try:
        verify(args.content_dir)
    except (ValueError, KeyError, TypeError, OSError, struct.error) as error:
        print(f'FAIL: {error}', file=sys.stderr)
        sys.exit(1)
