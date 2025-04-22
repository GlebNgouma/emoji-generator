import { EmojiValidationPipe } from './emoji-validation.pipe';
import { BadRequestException } from '@nestjs/common';

describe('EmojiValidationPipe', () => {
  const emojiValidationPipe = new EmojiValidationPipe();
  it('should be defined', () => {
    expect(emojiValidationPipe).toBeDefined();
  });

  it("devrait renvoyer undifund si aucune valeur n'est transmise", () => {
    const result = emojiValidationPipe.transform(undefined);
    expect(result).toBeUndefined();
  });

  it("devrait generer une erreur de mauvaise demande si la valeur n'est pas un nombre", () => {
    const result = () => emojiValidationPipe.transform('not a number');
    expect(result).toThrow(BadRequestException);
  });

  it('devrait generer une erreur de mauvaise demande si la valeur est inferieure à 0', () => {
    const result = () => emojiValidationPipe.transform(-10);
    expect(result).toThrow(BadRequestException);
  });

  it('devrait renvoyer la chaine sous forme de nombre', () => {
    const result = emojiValidationPipe.transform(`5`);
    expect(result).toEqual(5);
  });
});
