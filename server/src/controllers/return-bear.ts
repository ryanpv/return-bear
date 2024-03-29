import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// import * as linkify from 'linkifyjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const returnBear = async(req: Request, res: Response) => {
  try {
    const { phone_number } = req.body;
    const checkRegex = /^\d+$/; // RegEx to check if string contains only numbers
console.log('req: ', req.body);

    if (!checkRegex.test(phone_number) || phone_number === "") {
      res.status(400).json({ errMsg: "INVALID input. Submit only numbers without spaces" });
      return;
    }

    // const linkifiedText = linkify.find(message).map(link => link.href).join(' ');
    // console.log("linkified: ", linkifiedText);
    
    const filePath = path.join(__dirname, '..', 'data.json');
    const getData = await fs.readFile(filePath, 'utf8');
    const result = JSON.parse(getData);

    type PhoneData = {
      prefix: number | null,
      operator: null | string,
      country_code: number | null,
      country: string | null,
      region: null | string
    };

    let startIndex = 0;
    let endIndex = result.length - 1;
    let longestPrefix: PhoneData = {
      prefix: null,
      operator: null,
      country_code: null,
      country: null,
      region: null
    };

    while (startIndex <= endIndex) {
// ******************* COMPARE CURRENT PREFIX WITH DATAJSON INTERATION PREFIX *******************
      // if statements for duplicate prefixes found between result[startIndex] and result[endIndex] when a longestPrefix.prefix already exists 
      if (
        longestPrefix.prefix !== null
        && phone_number.indexOf(result[startIndex].prefix.toString()) === 0
        && longestPrefix.prefix === result[startIndex].prefix
        ) {
          longestPrefix.country = [result[startIndex].country, longestPrefix.country].join();
          longestPrefix.operator = [result[startIndex].operator, longestPrefix.operator].join();
          longestPrefix.region = [result[startIndex].region, longestPrefix.region].join();
        }
        
      // same if statement, but for [endIndex]
      if (
        longestPrefix.prefix !== null
        && phone_number.indexOf(result[endIndex].prefix.toString()) === 0
        && longestPrefix.prefix === result[endIndex].prefix
        ) {
          longestPrefix.country = [result[endIndex].country, longestPrefix.country].join();
          longestPrefix.operator = [result[endIndex].operator, longestPrefix.operator].join();
          longestPrefix.region = [result[endIndex].region, longestPrefix.region].join();
        }      

// ******************* CHECKING LONGEST PREFIX *******************
      // if value for longestPrefix.prefix exists, compare its length with the length of result[startIndex]. Return the longer value
      if (
        longestPrefix.prefix !== null
        && longestPrefix.prefix.toString().length < result[startIndex].prefix.toString().length 
        && phone_number.indexOf(result[startIndex].prefix.toString()) === 0
        ) {
        longestPrefix = result[startIndex];
      }

      // same if statement for [endIndex]
      if (
        longestPrefix.prefix !== null
        && longestPrefix.prefix.toString().length < result[endIndex].prefix.toString().length 
        && phone_number.indexOf(result[endIndex].prefix.toString()) === 0
        ) {
        longestPrefix = result[endIndex];
      }

        
// ******************* INITIAL VALUE SETTING (longestPrefix.prefix === null) *******************
      // Check if prefix values for startIndex and endIndex are same during same iterations

      // Covers condition where result[startIndex].prefix === result[endIndex].prefix on very first iteration
      // Must run be before if statements that look for null value, but result[start].prefix !== result[endIndex].prefix otherwise that if statement overwrites values
      if (
        result[startIndex].prefix === result[endIndex].prefix
        && phone_number.indexOf(result[startIndex].prefix.toString()) === 0
        && longestPrefix.prefix === null
      ) {
        longestPrefix = {
          prefix: result[startIndex].prefix,
          operator: [result[startIndex].operator, result[endIndex].operator].join(),
          country_code: result[startIndex].country_code,
          country: [result[startIndex].country, result[endIndex].country].join(),
          region: [result[startIndex].region, result[endIndex].region].join()
        }        
      }

      // Checks if result[startIndex].prefix matches longestPrefix.prefix and result[startIndex].prefix !== result[endIndex].prefix
      if (
        phone_number.indexOf(result[startIndex].prefix.toString()) === 0
        && longestPrefix.prefix === null
        ) {
        longestPrefix = result[startIndex]
      }

      // Initial prefix match for result[endIndex]
      if (
        phone_number.indexOf(result[endIndex].prefix.toString()) === 0
        && longestPrefix.prefix === null
        ) {
        longestPrefix = result[endIndex]
      }
             
      startIndex++
      endIndex--
    };

    res.status(200).json(longestPrefix);
  } catch (err) {
    console.log('error: ', err);
    res.status(400).json({ errMsg: "Unable to fulfill return request." });
  }
}

export default returnBear;
