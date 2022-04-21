// TASK 2: Clean and Sort the Transactions

const inputJSON = [
    {
      "id": 3,
      "sourceAccount": "A",
      "targetAccount": "B",
      "amount": 100,
      "category": "eating_out",
      "time": "2018-03-02T10:34:30.000Z"
    },
    {
      "id": 1,
      "sourceAccount": "A",
      "targetAccount": "B",
      "amount": 100,
      "category": "eating_out",
      "time": "2018-03-02T10:33:00.000Z"
    },
    {
      "id": 6,
      "sourceAccount": "A",
      "targetAccount": "C",
      "amount": 250,
      "category": "other",
      "time": "2018-03-02T10:33:05.000Z"
    },
    {
      "id": 4,
      "sourceAccount": "A",
      "targetAccount": "B",
      "amount": 100,
      "category": "eating_out",
      "time": "2018-03-02T10:36:00.000Z"
    },
    {
      "id": 2,
      "sourceAccount": "A",
      "targetAccount": "B",
      "amount": 100,
      "category": "eating_out",
      "time": "2018-03-02T10:33:50.000Z"
    },
    {
      "id": 5,
      "sourceAccount": "A",
      "targetAccount": "C",
      "amount": 250,
      "category": "other",
      "time": "2018-03-02T10:33:00.000Z"
    },
    {
      "id": 7,
      "sourceAccount": "A",
      "targetAccount": "B",
      "amount": 100,
      "category": "eating_out",
      "time": "2018-03-02T10:36:30.000Z"
    },
    {
      "id": 8,
      "sourceAccount": "A",
      "targetAccount": "B",
      "amount": 100,
      "category": "eating_out",
      "time": "2018-03-02T10:37:00.000Z"
    },
];

const result = findDuplicateTransactions(inputJSON);

console.log(result);

function findDuplicateTransactions(transactions = []) {
    // delay of 60 seconds
    const delayInMilliseconds = 1 * 60 * 1000;

    // sort data
    let sortedData = transactions.sort((a,b)=> a.time.localeCompare(b.time));

    //filter and group data
    let groupedDuplicate = [];
    let unfilteredData = sortedData;
    const keys = ['sourceAccount', 'targetAccount', 'amount', 'category'];

    while (unfilteredData.length) {
        // next unfiltered check
        let nextTemp = [];
        
        let trackedTransaction = unfilteredData[0];
        let duplicate = [trackedTransaction];

        unfilteredData.forEach((transaction, index) => {
            if (index > 0) {
                let d1 = new Date(transaction.time);
                let d2 = new Date(trackedTransaction.time);

                // filter grouped keys && difference in 60 seconds
                if (Math.abs(d1 - d2) <= delayInMilliseconds && keys.every(key => trackedTransaction[key] === transaction[key])) {
                    duplicate.push(transaction);
                    trackedTransaction = transaction;
                } else {
                    // push to unfiltered
                    nextTemp.push(transaction);
                }
            }
        });

        if (duplicate.length > 1) {
            groupedDuplicate.push(duplicate);
        }

        // update next unfiltered
        unfilteredData = nextTemp;
    }

    return groupedDuplicate;
}
