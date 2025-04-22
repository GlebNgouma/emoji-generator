import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getEmoji(index?: number): string {
    console.log('Route Handler');
    const emojis = this.getEmojis();
    const emojiIndex =
      typeof index !== 'undefined'
        ? index
        : Math.floor(Math.random() * emojis.length); // si index est undefined, on prend un emoji aleatoire
    return emojis[emojiIndex];
  }

  getEmojis() {
    return [`😊`, `🎉`, `😍`, `🐱‍🚀`, `🦝`, '😂', '🤑', '🙀', '🐭', '👨‍🦰'];
  }
}
