import CalificationAndCategorySchool from "./CalificationAndCategorySchool";
import CalificationAndCategoryInvestigation from "./CalificationAndCategoryInvestigation";

const CalificationAndCategory = ({
  typePage = "micro-col",
  excelSource,
  maxStars = 5,
}) => {
  switch (typePage) {
    case "investigation":
      return (
        <CalificationAndCategoryInvestigation
          excelSource={excelSource}
          maxStars={maxStars}
        />
      );

    case "micro-col":
    case "micro-uni":
    default:
      return (
        <CalificationAndCategorySchool
          excelSource={excelSource}
          maxStars={maxStars}
        />
      );
  }
};

export default CalificationAndCategory;
