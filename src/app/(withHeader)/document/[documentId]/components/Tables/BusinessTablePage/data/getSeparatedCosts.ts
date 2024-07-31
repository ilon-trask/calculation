import { BusType } from "@/app/data/Cost.actions";

export type SeparatedCostsType = {
  thisYearIncomes: BusType[];
  thisYearExpenses: BusType[];
  thisYearIncomesOwn: BusType[];
  thisYearIncomesCredits: BusType[];
  thisYearExpensesOperationalPermanent: BusType[];
  thisYearExpensesOperationalGeneral: BusType[];
  thisYearExpensesOperationalStraight: BusType[];
  thisYearExpensesInvestmentPermanent: BusType[];
  thisYearExpensesInvestmentGeneral: BusType[];
  thisYearExpensesInvestmentStraight: BusType[];
  thisYearExpensesOperationalNotAmortization: BusType[];
  thisYearExpensesNotAmortization: BusType[];
  thisYearIncomesAmortization: BusType[];
  thisYearExpensesOperationalAmortization: BusType[];
  thisYearExpensesInvestment: BusType[];
};

function getSeparatedCosts(thisYearCosts: BusType[]): SeparatedCostsType {
  const thisYearIncomes = thisYearCosts.filter((el) => el.isIncome);
  const thisYearIncomesAmortization = thisYearIncomes.filter(
    (el) => el.costSubtype == "амортизація"
  );
  const thisYearIncomesOwn = thisYearIncomes.filter(
    (el) => el.costSubtype == "власні"
  );
  const thisYearIncomesCredits = thisYearIncomes.filter(
    (el) => el.costSubtype == "залучені позики"
  );
  const thisYearExpenses = thisYearCosts.filter((el) => !el.isIncome);

  const thisYearExpensesNotAmortization = thisYearExpenses.filter(
    (el) => el.costSubtype != "амортизація"
  );
  const thisYearExpensesInvestment = thisYearExpenses.filter(
    (el) => el.activityType == "інвестиційна"
  );
  const thisYearExpensesOperational = thisYearExpenses.filter(
    (el) => el.activityType == "операційна"
  );
  const thisYearExpensesOperationalPermanent =
    thisYearExpensesOperational.filter(
      (el) => el.costSubtype == "витрати постійні"
    );
  const thisYearExpensesOperationalGeneral = thisYearExpensesOperational.filter(
    (el) => el.costSubtype == "витрати заг-вир"
  );
  const thisYearExpensesOperationalStraight =
    thisYearExpensesOperational.filter(
      (el) => el.costSubtype == "витрати прямі"
    );
  const thisYearExpensesOperationalNotAmortization =
    thisYearExpensesOperational.filter((el) => el.costSubtype != "амортизація");
  const thisYearExpensesOperationalAmortization =
    thisYearExpensesOperational.filter((el) => el.costSubtype == "амортизація");
  const thisYearExpensesInvestmentPermanent = thisYearExpensesInvestment.filter(
    (el) => el.costSubtype == "витрати постійні"
  );
  const thisYearExpensesInvestmentGeneral = thisYearExpensesInvestment.filter(
    (el) => el.costSubtype == "витрати заг-вир"
  );
  const thisYearExpensesInvestmentStraight = thisYearExpensesInvestment.filter(
    (el) => el.costSubtype == "витрати прямі"
  );
  return {
    thisYearIncomes,
    thisYearExpenses,
    thisYearIncomesOwn,
    thisYearIncomesCredits,
    thisYearIncomesAmortization,
    thisYearExpensesOperationalPermanent,
    thisYearExpensesOperationalGeneral,
    thisYearExpensesOperationalStraight,
    thisYearExpensesInvestmentPermanent,
    thisYearExpensesInvestmentGeneral,
    thisYearExpensesInvestmentStraight,
    thisYearExpensesOperationalNotAmortization,
    thisYearExpensesNotAmortization,
    thisYearExpensesOperationalAmortization,
    thisYearExpensesInvestment,
  };
}

export default getSeparatedCosts;
