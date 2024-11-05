import dotenv from 'dotenv';
import splitwise, { NewExpense } from 'splitwise';

dotenv.config();

const PAID_USER_ID = getEnvVar<number>('PAID_USER_ID') 
const OWED_USER_ID = getEnvVar<number>('OWED_USER_ID') 
const CONSUMER_KEY = getEnvVar<string>('CONSUMER_KEY') 
const CONSUMER_SECRET = getEnvVar<string>('CONSUMER_SECRET') 
const GROUP_ID = getEnvVar<number>('GROUP_ID') 
const HOUSE_RENT_TOTAL = getEnvVar<string>('HOUSE_RENT_TOTAL') 
const HOUSE_RENT_OWN = getEnvVar<string>('HOUSE_RENT_OWN') 

const main=async ()=>{
  const sw =splitwise({consumerKey: CONSUMER_KEY, consumerSecret: CONSUMER_SECRET});
  const expense = createRentData()
  await sw.createExpense(expense)
}

const createRentData=(now:Date=new Date())=>{
  // Date class will automatically handle the month overflow
  // For example, if the current month is December, the next month will be January of the next year
  const nextMonth = new Date(now.getFullYear(),now.getMonth()+1)
  return {
      group_id: GROUP_ID,
      // The rent is paid by the end of the month for the next month
      description: `House rent for ${nextMonth.getFullYear()}-${nextMonth.getMonth()+1}`,
      cost: HOUSE_RENT_OWN,
      currency_code: "JPY",
      details: `House rent for ${nextMonth.getFullYear()}-${nextMonth.getMonth()+1} (Total ${HOUSE_RENT_TOTAL} yen). Created by splitwise-api`,
      split_equally: false,
      users:[
        {user_id:PAID_USER_ID,paid_share:HOUSE_RENT_OWN,owed_share:"0"},
        {user_id:OWED_USER_ID,paid_share:"0","owed_share":HOUSE_RENT_OWN}
      ],
    } as NewExpense
}

function getEnvVar<T extends string|number>(name: string): T{
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value as T;
}


main();