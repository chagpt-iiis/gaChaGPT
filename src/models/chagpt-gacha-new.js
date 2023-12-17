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

    roll(amount=5) {
        console.log('amount', amount)
        const roll = [];
        for (let i = 0; i < amount; i++) {
            roll.push(this.rollOnce());
        }
        return roll;
    }

    rollOnce() {
        this.attemptsCount++;

        this.shuffleArray(this.drops);
        this.shuffleArray(this.prizePool);
        const item = this.drops.pop();

        for (let idx = 0; idx < this.prizePool.length; idx++) {
            const prize = this.prizePool[idx];

            if (prize.level === '5-star' && this.attemptsCount >= this.threshold5) {
                this.assignPrizeToItem(idx, item);
                break;
            } else if (prize.level === '4-star' && this.attemptsCount >= this.threshold4) {
                this.assignPrizeToItem(idx, item);
                break;
            } else if (prize.level === '3-star' && this.attemptsCount >= this.threshold3) {
                this.threshold3 += this.pity3Limit;
                this.assignPrizeToItem(idx, item);
                break;
            } else if (prize.level === '1-star' || prize.level === '2-star') {
                this.assignPrizeToItem(idx, item);
                break;
            }
        }

        console.log('item.assigned', item.assigned)
        console.log('item.assignedLevel', item.assignedLevel)
        console.log('drops.length', this.drops.length)
        console.log('prizePool.length', this.prizePool.length)
        console.log('assignedDrops.length', this.assignedDrops.length)
        console.log('assignedPrize.length', this.assignedPrize.length)

        return item;
    }

    assignPrizeToItem(idx, item) {
        const prize = this.prizePool.splice(idx, 1)[0];
        item.assigned = true;
        item.assignedLevel = prize.level;
        item.assignedRating = prize.rating;

        prize.assigned = true;
        prize.assignToId = item.id;
        prize.assignToTeaType = item.teaType;
        prize.assignToUniqueId = item.uniqueId;

        this.assignedDrops.push(item);
        this.assignedPrize.push(prize);
    }

    generateDrops(lastIdxDict = { 'tea_a': 199, 'tea_b': 199, 'tea_c': 199, 'tea_d': 199, 'tea_e': 199, 'tea_f': 199 }) {
        const drops = [];
        let uniqueId = 0;

        for (const teaType in lastIdxDict) {
            for (let j = 0; j < lastIdxDict[teaType]; j++) {

                const src = `${teaType}.png`;

                drops.push({
                    teaType: teaType,
                    id: j,
                    src: src,
                    uniqueId: uniqueId,
                    assigned: false,
                    assignedLevel: '0-star',
                    assignedRating: 0,
                });
                uniqueId++;
            }
        }

        return drops;
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
}