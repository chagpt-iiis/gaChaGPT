import numpy as np

class ChagptGacha(object):

    def __init__(self):
        self.drops = self.generate_drops()
        self.assigned_drops = []

        self.prize_pool = self.generate_pool()
        self.assigned_prize = []

        self.attemptsCount = 0
        self.pity3Limit = 25
        self.threshold3 = 0
        self.threshold4 = 50
        self.threshold5 = 70

        # useless property
        self.pityCounter3 = 0
        self.pityCounter4 = 0
        self.pityCounter5 = 0


    def roll(self, amount):
        roll = []
        for i in range(amount):
            roll.append(self.rollOnce())
        return roll


    def rollOnce(self):
        self.attemptsCount += 1

        np.random.shuffle(self.drops)
        np.random.shuffle(self.prize_pool)
        item = self.drops.pop()

        for idx, prize in enumerate(self.prize_pool):
            if (prize['level'] == '5-star') and (self.attemptsCount >= self.threshold5):
                self.assign_prize_to_item(idx, item)
            elif (prize['level'] == '4-star') and (self.attemptsCount >= self.threshold4):
                self.assign_prize_to_item(idx, item)
            elif (prize['level'] == '3-star') and (self.attemptsCount >= self.threshold3):
                self.threshold3 += self.pity3Limit
                self.assign_prize_to_item(idx, item)
            elif prize['level'] == '1-star' or prize['level'] == '2-star':
                self.assign_prize_to_item(idx, item)

        return item


    def assign_prize_to_item(self, idx, item):

        prize = self.prize_pool.pop(idx)
        item['assigned'] = True
        item['assigned_level'] = prize['level']

        prize['assigned'] = True
        prize['assign_to_id'] = item['id']
        prize['assign_to_tea_type'] = item['tea_type']
        prize['assign_to_unique_id'] = item['unique_id']

        self.assigned_drops.append(item)
        self.assigned_prize.append(prize)


    def generate_drops(
        self, last_idx_dict = {'tea_a': 199, 'tea_b': 199, 'tea_c': 199, 'tea_d': 199, 'tea_e': 199, 'tea_f': 199}
    ):
        drops = []
        unique_id = 0
        for tea_type in last_idx_dict.keys():
            for j in range(last_idx_dict[tea_type]):
                drops.append({
                    'tea_type': tea_type,
                    'id': j,
                    'unique_id': unique_id,
                    'assigned': False,
                    'assigned_level': '0-star'
                })
                unique_id += 1
        return drops


    def generate_pool(
        self, prize_num_dict = {'1-star': 60, '2-star': 10, '3-star': 3, '4-star': 1, '5-star': 1}
    ):
        pool = []
        for level in prize_num_dict.keys():
            for num in range(prize_num_dict[level]):
                pool.append({
                    'level': level,
                    'id': num,
                    'assigned': False,
                    'assign_to_id': 0,
                    'assign_to_tea_type': 'tea_x',
                    'assign_to_unique_id': 0,
                })

    
    def getState(self):
        return {
            'attemptsCount': self.attemptsCount,
            'threshold3': self.threshold3,
            'drops': self.drops,
            'prize_pool': self.prize_pool,
            'assigned_drops': self.assigned_drops,
            'assigned_prize': self.assigned_prize,
        }

    def setState(self, state):
        self.attemptsCount = state.attemptsCount
        self.threshold3 = state.threshold3
        self.drops = state.drops
        self.prize_pool = state.prize_pool
        self.assigned_drops = state.assigned_drops
        self.assigned_prize = state.assigned_prize

    def reset(self):
        self.attemptsCount = 0
        self.threshold3 = 0
        self.drops = self.generate_drops()
        self.prize_pool = self.generate_pool()
        self.assigned_drops = []
        self.assigned_prize = []