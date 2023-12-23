#!/usr/bin/env python3

from random import Random
import json

with open('info.json') as f:
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

'''
levels:
	0 -> { 0, 1, 2 }
	1 -> if(three 2's, 2, { 0, 1, 2 })
	2 -> if(two 2's, 2, { 0, 1, 2 })
	3 -> { 0, 1, 2, 3 }
	4 -> { 0, 1, 2, 3, 4 }
'''
def Roll(rng, level):
	global prize
	if level in [1, 2]:
		assert prize[2] <= 4 - level
		if prize[2] == 4 - level:
			return 2
	upper = max(level, 2) + 1
	s = sum(prize[:upper])
	assert s > 0
	k = rng._randbelow(s)
	for i in range(upper):
		if k < prize[i]:
			return i
		k -= prize[i]
	assert False

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
	print(f'level: \x1b[32m{level}\x1b[0m, block: \x1b[32m{block}\x1b[0m, hash: \x1b[33m{hex_hash}\x1b[0m')
	seed = int(hex_hash, 16)
	rng = Random(seed)

	for k in range(5):
		idx = rng._randbelow(len(S))
		item = S.pop(idx)

		award = Roll(rng, level)
		assert prize[award] > 0
		prize[award] -= 1

		print(f'  \x1b[36m{k}\x1b[0m -> (\x1b[33m{item}\x1b[0m, \x1b[32m{award}\x1b[0m)')

print(f'remaining: \x1b[36m{prize}\x1b[0m')
