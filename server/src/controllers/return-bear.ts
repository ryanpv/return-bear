import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const returnBear = async(req: Request, res: Response) => {
  try {
    const { phone_number } = req.body;
    const checkRegex = /^\d+$/; // RegEx to check if string contains only numbers

    if (!checkRegex.test(phone_number) || phone_number === "") {
      res.status(400).json({ errMsg: "INVALID input. Submit only numbers without spaces" });
      return;
    }
    
    const filePath = path.join(__dirname, '..', 'data.json');
    const getData = await fs.readFile(filePath, 'utf8');
    const dataSet = JSON.parse(getData);

    type PhoneData = {
      prefix: number | null,
      operator: null | string,
      country_code: number | null,
      country: string | null,
      region: null | string
    };

    let leftIndex = 0;
    let rightIndex = dataSet.length - 1;
    let longestPrefix: PhoneData = {
      prefix: null,
      operator: null,
      country_code: null,
      country: null,
      region: null
    };
    
    while (leftIndex <= rightIndex) {
      const noPrefixStored = longestPrefix.prefix === null;
      // const prefixStored = longestPrefix.prefix !== null;
      const leftPrefixValue = dataSet[leftIndex].prefix;
      const rightPrefixValue = dataSet[rightIndex].prefix;
      const phoneStartsWithLeft = phone_number.indexOf(dataSet[leftIndex].prefix.toString()) === 0;
      const phoneStartsWithRight = phone_number.indexOf(dataSet[rightIndex].prefix.toString()) === 0;

      if (noPrefixStored) { // Find the initial prefix match
        if ( // Store value of both pointers
          leftPrefixValue === rightPrefixValue
          && phoneStartsWithLeft
        ) {
          longestPrefix = {
            prefix: dataSet[leftIndex].prefix,
            operator: [dataSet[leftIndex].operator, dataSet[rightIndex].operator].join(),
            country_code: dataSet[leftIndex].country_code,
            country: [dataSet[leftIndex].country, dataSet[rightIndex].country].join(),
            region: [dataSet[leftIndex].region, dataSet[rightIndex].region].join()
          };
        } else if (phoneStartsWithLeft) { // Store value of left pointer
          longestPrefix = dataSet[leftIndex]
        } else if (phoneStartsWithRight) { // Store value of right pointer
          longestPrefix = dataSet[rightIndex]
        }
      } else { // Update stored prefix with longest value
        if ( // Add value of left pointer to stored value
            phoneStartsWithLeft
            && longestPrefix.prefix === leftPrefixValue
          ) {
            longestPrefix.country = [dataSet[leftIndex].country, longestPrefix.country].join();
            longestPrefix.operator = [dataSet[leftIndex].operator, longestPrefix.operator].join();
            longestPrefix.region = [dataSet[leftIndex].region, longestPrefix.region].join();
          } else if (
            phoneStartsWithLeft // Store value of left pointer
            && longestPrefix.prefix.toString().length < leftPrefixValue.toString().length
          ) {
            longestPrefix = dataSet[leftIndex]
          }
          
        if ( // Add value of right pointer to stored vlaue
          phoneStartsWithRight
          && longestPrefix.prefix === rightPrefixValue
        ) {
          longestPrefix.country = [dataSet[rightIndex].country, longestPrefix.country].join();
          longestPrefix.operator = [dataSet[rightIndex].operator, longestPrefix.operator].join();
          longestPrefix.region = [dataSet[rightIndex].region, longestPrefix.region].join();
        } else if ( // Store value of right pointer
          phoneStartsWithRight
          && longestPrefix.prefix.toString().length < rightPrefixValue.toString().length
        ) {
          longestPrefix = dataSet[rightIndex];
        }
  
      };

      leftIndex++
      rightIndex--
    };

    res.status(200).json(longestPrefix);
  } catch (err) {
    console.log('error: ', err);
    res.status(400).json({ errMsg: "Unable to fulfill return request." });
  }
}

export default returnBear;
