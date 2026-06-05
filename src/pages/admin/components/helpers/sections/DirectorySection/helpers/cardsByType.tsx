import { CardItemCol, CardItemMtop } from "../cardsDirectory";
import { CardItemColCompact } from "../cardsDirectory/CardItemColCompact";
import { CardColSapiens } from "../cardsRandomm";

export const cardByType = {
  "COL": {
    cardRandom: CardColSapiens,
    cardDirectory: CardItemCol,
    cardDirectoryCompact: CardItemColCompact
  },
  "M-TOP": {
    cardRandom: CardColSapiens,
    cardDirectory: CardItemMtop
  },
};