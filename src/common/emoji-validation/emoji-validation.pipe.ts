import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmojiValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      console.log(value);
      return;
    }
    if (isNaN(value))
      throw new BadRequestException(
        `Validation echouée: ${value} n'est pas un nombre`,
      );

    if (value < 0 || value > 10) {
      throw new BadRequestException(
        `Validation echouée: ${value} ne peut pas être un nombre négatif ou superieur à 10`,
      );
    }
    const result = parseInt(value, 10);
    console.log(`Pipe: Validation réussie`);
    return result;
  }
}
