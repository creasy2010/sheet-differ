import { newData, oldData } from './data'
import { Data2Array } from './utils'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import daff from 'daff/lib/core';
// const daff = require('daff')

// console.log(diffSheetRows(
//   { data: { dataTable: oldData } },
//   { data: { dataTable: newData } }
// ))

const data1 = Data2Array(oldData)
const data2 = Data2Array(newData)

const data3= [
  ['Country','Capital'],
  ['Ireland','Dublin'],
  ['France','Paris'],
  ['Spain','Barcelona']
];
const data4 = [
  ['Country','Code','Capital'],
  ['Ireland','ie','Dublin'],
  ['France','fr','Paris'],
  ['Spain','es','Madrid'],
  ['Germany','de','Berlin']
];

console.log(data1)
console.log(data2)

const table1 = new daff.TableView(data1.cells)
const table2 = new daff.TableView(data2.cells)

// const table1 = new daff.TableView([])
// const table2 = new daff.TableView([])

// const table1 = new daff.TableView(data3)
// const table2 = new daff.TableView(data4)

const diff = daff.diff(table1,table2);
console.log(diff)