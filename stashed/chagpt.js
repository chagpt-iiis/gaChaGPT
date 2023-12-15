import BaseGacha from './base-gacha'
import drops from '../data/chagpt.json'

export default class ChaGPT extends BaseGacha {
  constructor() {
    super(drops)
  }
}
