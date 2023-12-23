import mt19937 from '@stdlib/random-base-mt19937';

export default class ChagptGachaNew {
    constructor() {
        this.drops = this.generateDrops();
        this.assignedDrops = [];

        this.prizePool = this.generatePool();
        this.assignedPrize = [];

        this.attemptsCount = 0;
        this.pity3Limit = 25;
        this.threshold3 = 0;
        this.threshold4 = 50;
        this.threshold5 = 70;

        // useless property
        this.pityCounter3 = 0;
        this.pityCounter4 = 0;
        this.pityCounter5 = 0;
    }

    roll(amount = 5) {
        let seed = new Uint32Array(unitTestSeeds.pop());

        let i;
        console.log('seed =', seed);
        seed.reverse();
        for (i = seed.length; i > 0 && !seed[i - 1]; --i);
        const rng = mt19937.factory({ seed: seed.subarray(0, i) });

        const roll = [];
        for (let i = 0; i < amount; i++) {
            roll.push(this.rollOnceWithRng(rng));
        }

        return roll;
    }

    rollOnceWithRng(rng) {
        console.log(this.drops.length, this.prizePool.length);

        this.attemptsCount++;

        const idx = this.randBelowWithRng(this.drops.length, rng);
        const item = this.drops.splice(idx, 1)[0];

        if (this.attemptsCount === (this.threshold3 + this.pity3Limit)) {
            const index = this.prizePool.findIndex(prize => prize.level === '3-star');
            if (index < 0) {
                console.error('not enough 3-star!!!');
            } else {
                this.threshold3 += this.pity3Limit;
                this.assignPrizeToItem(index, item);
            }
            return item;
        }

        const pool = this.prizePool.filter(prize => {
            switch (prize.level) {
                case '5-star':
                    return this.attemptsCount > this.threshold5;
                case '4-star':
                    return this.attemptsCount > this.threshold4;
                case '3-star':
                    return this.attemptsCount > this.threshold3;
                default:
                    return true;
            }
        });

        const index = this.randBelowWithRng(pool.length, rng);
        const prize = pool[index];
        if (prize.level === '3-star') {
            this.threshold3 += this.pity3Limit;
        }
        this.assignPrizeToItem(index, item);

        return item;
    }

    rollOnce() {
        this.attemptsCount++;

        this.shuffleArray(this.drops);
        const item = this.drops.pop();

        this.shuffleArray(this.prizePool);

        for (let idx = 0; idx < this.prizePool.length; idx++) {
            const prize = this.prizePool[idx];

            if (this.attemptsCount === (this.threshold3 + this.pity3Limit)) {
                if (prize.level === '3-star') {
                    this.threshold3 += this.pity3Limit;
                    this.assignPrizeToItem(idx, item);
                    break;
                }
            } else {
                if (prize.level === '5-star' && this.attemptsCount > this.threshold5) {
                    this.assignPrizeToItem(idx, item);
                    break;
                } else if (prize.level === '4-star' && this.attemptsCount > this.threshold4) {
                    this.assignPrizeToItem(idx, item);
                    break;
                } else if (prize.level === '3-star' && this.attemptsCount > this.threshold3) {
                    this.threshold3 += this.pity3Limit;
                    this.assignPrizeToItem(idx, item);
                    break;
                } else if (prize.level === '1-star' || prize.level === '2-star') {
                    this.assignPrizeToItem(idx, item);
                    break;
                }
            }
        }

        // console.log('item.assigned', item.assigned)
        // console.log('item.assignedLevel', item.assignedLevel)
        // console.log('drops.length', this.drops.length)
        // console.log('prizePool.length', this.prizePool.length)
        // console.log('assignedDrops.length', this.assignedDrops.length)
        // console.log('assignedPrize.length', this.assignedPrize.length)

        return item;
    }

    assignPrizeToItem(idx, item) {
        const prize = this.prizePool.splice(idx, 1)[0];
        item.assigned = true;
        item.assignedLevel = prize.level;
        item.assignedRating = prize.rating;
        item.assignedLevelChs = this.Level2LevelChs(prize.level);
        item.color = this.Level2Color(prize.level)

        prize.assigned = true;
        prize.assignToId = item.id;
        prize.assignToTeaType = item.teaType;
        prize.assignToUniqueId = item.uniqueId;

        this.assignedDrops.push(item);
        this.assignedPrize.push(prize);
    }

    generateDrops(lastIdxDict = { 'tea_a': 200, 'tea_b': 200, 'tea_c': 200, 'tea_d': 200, 'tea_e': 200, 'tea_f': 200 }) {
        const drops = [];
        let uniqueId = 0;

        for (const teaType in lastIdxDict) {
            for (let j = 0; j < lastIdxDict[teaType]; j++) {

                const src = `${teaType}.png`;
                const teaName = this.TeaType2TeaName(teaType);
                const teaNameId = `${teaName}-${j}`;
                const debugTeaName = teaType[4].toUpperCase();

                drops.push({
                    teaType: teaType,
                    id: j,
                    src: src,
                    teaName: debugTeaName,
                    teaNameId: teaNameId,
                    uniqueId: uniqueId,
                    assigned: false,
                    assignedLevel: '0-star',
                    assignedRating: 0,
                    assignedLevelChs: '未获奖',
                    color: '#000000'
                });
                uniqueId++;
            }
        }

        return drops;
    }

    TeaType2TeaName(teaType) {
        switch(teaType){
            case 'tea_a':
                return '高山乌龙'
            case 'tea_b':
                return '凤凰单枞'
            case 'tea_c':
                return '玫瑰花茶'
            case 'tea_d':
                return '锡兰红茶'
            case 'tea_e':
                return '安溪铁观音'
            case 'tea_f':
                return '金骏眉'
        }
    }

    Level2LevelChs(Level) {
        switch(Level){
            case '1-star':
                return '三等奖'
            case '2-star':
                return '二等奖'
            case '3-star':
                return '一等奖'
            case '4-star':
                return '特等奖'
            case '5-star':
                return '姚姚领先奖'
        }
    }

    Level2Color(Level) {
        switch(Level){
            case '1-star':
                return '#39b54a'
            case '2-star':
                return '#0071bc'
            case '3-star':
                return '#7030a0'
            case '4-star':
                return '#ff8800'
            case '5-star':
                return '#e94121'
        }
    }



    generatePool(prizeNumDict = { '1-star': 60, '2-star': 10, '3-star': 3, '4-star': 1, '5-star': 1 }) {
        const pool = [];

        for (const level in prizeNumDict) {
            for (let num = 0; num < prizeNumDict[level]; num++) {

                const match = level.match(/^(\d)-star$/);
                const rating = match ? parseInt(match[1]) : 0;

                pool.push({
                    level: level,
                    rating: rating,
                    id: num,
                    assigned: false,
                    assignToId: 0,
                    assignToTeaType: 'tea_x',
                    assignToUniqueId: 0,
                });
            }
        }

        return pool;
    }

    getState() {
        return {
            attemptsCount: this.attemptsCount,
            threshold3: this.threshold3,
            drops: this.drops,
            prizePool: this.prizePool,
            assignedDrops: this.assignedDrops,
            assignedPrize: this.assignedPrize,
        };
    }

    setState(state) {
        this.attemptsCount = state.attemptsCount;
        this.threshold3 = state.threshold3;
        this.drops = state.drops;
        this.prizePool = state.prizePool;
        this.assignedDrops = state.assignedDrops;
        this.assignedPrize = state.assignedPrize;
    }

    reset() {
        this.attemptsCount = 0;
        this.threshold3 = 0;
        this.drops = this.generateDrops();
        this.prizePool = this.generatePool();
        this.assignedDrops = [];
        this.assignedPrize = [];
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    randBelowWithRng(n, rng) {
        if (!n) {
            console.error('call rand(0) !!!');
            return 0;
        }
        const k = Math.clz32(n);
        let r;
        do { r = rng() >>> k; } while (r >= n);
        return r;
    }
}

const unitTestSeeds = [
    [0xdbeb6048, 0xf8139dfc, 0x2253f73f, 0x4b3d5e87, 0x493a3fec, 0x0af39fd2, 0xcbbc1c8f, 0x4b496fd0],
    [0x1cac36ed, 0x4378f6a3, 0x21beae4f, 0xce83ed26, 0x224b3d28, 0x3585558b, 0xff0b5498, 0x2802c792],
    [0x11a082a8, 0x125e0ff0, 0x3384e72f, 0x4dd7e6b4, 0x1f4f32f0, 0xf6eccdda, 0xca82346d, 0x4df4a478],
    [0x16e680f5, 0xd5e53d3d, 0x41967b43, 0x51fdd84a, 0x6e625b9b, 0x5b2dcf76, 0xf4a4e77f, 0xf9edeb5c],
    [0x17b26a2e, 0xb8135230, 0x76d74133, 0xba59995d, 0xb7fe7047, 0x2d16f931, 0x677ff724, 0xc6313e65],
    [0x4ee61bc3, 0x11d05a62, 0x59574bc3, 0xf3991473, 0x522796a3, 0xe6632082, 0xc02707c4, 0xad9ee50c],
    [0x8edccd9b, 0xcec832ab, 0xfe6bf988, 0xa3ee8fdc, 0x290b0fdc, 0xf18e259b, 0x16c606e3, 0x86a46c29],
    [0x4957ba25, 0xcbc03a13, 0xa8e7ed10, 0xc875b996, 0xd08f4334, 0x47df44c8, 0xab5ca484, 0xaad2ff47],
    [0x523e3cb7, 0xded51c27, 0x66604d82, 0x61d109f3, 0xd5856c1b, 0x723f18d5, 0x79a3063b, 0x99fa9090],
    [0x534b4f85, 0x6500bedd, 0xac895d71, 0xd15fa124, 0xcc3e6d0d, 0x61b38bdb, 0xaea5016d, 0x67cddd51],
    [0x32146b90, 0x724207f0, 0x2095dd18, 0xee4e01b3, 0x1d19627d, 0xe6644839, 0x05c6b3ad, 0x7b0ec481],
    [0xc70f7882, 0x3b980361, 0x1aa6e91c, 0x39d60371, 0xef1b8f76, 0xbb2ba286, 0x7b02f498, 0x6c1b733d],
    [0x73431008, 0x25c416e8, 0x0a419aa1, 0x326bb744, 0x52bd698b, 0x2b1af8c0, 0xbbcf62a8, 0x904b3e7d],
    [0xc1ff735e, 0x8e1def6f, 0xc25328a4, 0x180621b6, 0xfb04f465, 0x26bb90fa, 0x1722e40c, 0x0e83f003],
    [0x6c07847e, 0xf2f9fd47, 0xec4bf36b, 0xed88d93e, 0x179870b4, 0x91c16b02, 0xe302573b, 0xb4d8a094],
];
