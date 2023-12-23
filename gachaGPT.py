#!/usr/bin/env python3

from random import Random
from sys import argv
import json

with open(argv[1] if len(argv) > 1 else 'info.json') as f:
	config = json.load(f)

S = set()
for i, c in enumerate(config['counts']):
	ty = chr(65 + i)
	for j in range(c):
		S.add(ty + str(j).zfill(3))
for ex in config['exclude']:
	S.remove(ex)
S = sorted(S)

prize = config['prize']
assert len(prize) == 5

cache = config['cache']

award_str = [
	'\x1b[1;34m三等奖\x1b[0m',
	'\x1b[1;32m二等奖\x1b[0m',
	'\x1b[1;33m一等奖\x1b[0m',
	'\x1b[1;31m特等奖\x1b[0m',
	'\x1b[1;31m姚姚领先奖\x1b[0m',
]
'''
levels:
	0 -> if(three 2's, { 0, 1, 2 }, { 0, 1 })
	1 -> if(three 2's, 2, { 0, 1 })
	2 -> if(two 2's, { 0, 1, 2 }, { 0, 1 })
	3 -> if(two 2's, 2, { 0, 1 })
	4 -> { 0, 1, 2, 3 }
	5 -> { 0, 1, 2, 3, 4 }
'''
def Roll(rng, level):
	global prize
	if level == 0:
		if prize[2] == 3:
			upper = 3
		elif prize[2] == 2:
			upper = 2
		else:
			assert False
	elif level == 1:
		if prize[2] == 3:
			return 2
		elif prize[2] == 2:
			upper = 2
		else:
			assert False
	elif level == 2:
		if prize[2] == 2:
			upper = 3
		elif prize[2] == 1:
			upper = 2
		else:
			assert False
	elif level == 3:
		if prize[2] == 2:
			return 2
		elif prize[2] == 1:
			upper = 2
		else:
			assert False
	else:
		upper = level
	s = sum(prize[:upper])
	assert s > 0
	k = rng._randbelow(s)
	for i in range(upper):
		if k < prize[i]:
			return i
		k -= prize[i]
	assert False


exclude_li = []
for roll in config['rolls']:
	level = roll['level']
	block = roll['block']
	hex_hash = cache.get(str(block))
	if hex_hash is None:
		import requests
		res = requests.get(
			f'https://blockexplorer.one/ajax/eth/mainnet/block-info/{block}?numeric=1',
			headers = config['headers']
		)
		res.encoding = 'utf8'
		r = res.json()
		hex_hash = r['hash'][2:]
	print(f'level: \x1b[32m{level}\x1b[0m, block: \x1b[32m{block}\x1b[0m, hash: \x1b[36m{hex_hash}\x1b[0m')
	seed = int(hex_hash, 16)
	rng = Random(seed)

	exclude_row = []
	print('    ', end='')
	for k in range(5):
		idx = rng._randbelow(len(S))
		item = S.pop(idx)
		exclude_row.append(f'"\x1b[35m{item}\x1b[0m"')

		award = Roll(rng, level - 1 if level in [1, 3] and k < 4 else level)
		assert prize[award] > 0
		prize[award] -= 1

		print(f'(\x1b[1;35m{item}\x1b[0m, {award_str[award]})', end='')
		if k != 4:
			print(', ', end='')
	exclude_li.append('    ' + ', '.join(exclude_row))
	print('\n')

print('exclude: [\n' + ',\n'.join(exclude_li) + '\n]')
print(f'remaining: \x1b[36m{prize}\x1b[0m')
