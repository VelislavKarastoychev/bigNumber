# bigNumber.js
### an arbitrary-length numbers library for javascript, that allows you to make elementary operations with lond numbers.
## Usage:
You can create a big number object with the function 
'''
new bigNumber()
'''. You can pass a javascript number, a string with decimal digits, a scientific number or accounting number (i.e. 2,5437,987.50). If you do not inside a paramether, you will create a big number with value zero (0). 
The properties of the bigNumber object are:
1. value --> the value of the big number without the sign
2. sign --> the sign of the number can be '+' or '-'
3. didits
4. integer --> the integer part of a number
5. float --> the digits after the floating point. If do not exist is equal to '0'
If you want to pass another bigNumber object you have to use the function: 
``` javascript
bigNumber.toBigNumber()
```
wich gets javascript numbers, stringified numbers and bigNumbers.
If you want to pass a non-decimal integer number you must convert it to decimal with the function:
``` javascript
bigNumber.convertToDecimal()
```  
The methods of bigNumbers return bigNumber objects that allows you to chain methods.

## Methods:

**_update()_**
Returns new bigNumber with the changed integer or float parts.
_Example:_
```javascript
let a = new bigNumber(1234.56789);
console.log(a.value);//'1234.56789'
a.float = '1234';
a.integer = '56789';
a = a.update();
console.log(a); //'56789.1234'
```
**_Number()_**
Returns new instance of a bigNumber (= bigNumber.toBigNumber)
_Example_
```javascript
let a = new bigNumber(100),
b = a.Number();
a.integer = '99';
a = a.update();
console.log(a.value);//'99'
console.log(b.value);//100
```
**_Digits()_**
Returns the digits of an bigNumber like bigNumber
_Example_
```javascript
let a = new bigNumber('123456789098765432123456789087654321');
console.log(a.Digits);
bigNumber { value: '35', sign: '+', digits: 1, integer: '35', float: '0' }
```
**_Integer()_ and _Float()_**
Return the integer and the float part of a bigNumber like bigNumber object.
_Example_
```javascript
let n = new bigNumber('3.14159');
let m = n.Integer();
let l = n.Float();
console.log(m.value);//'3'
console.log(l.value);//'14159'
```
**_convertToNumber()_ or _convertToJSNumber()_**
```javascript
let k = new bigNumber('21');
k.convertToNumber()//21
let l = new bigNumber('1234567890987654321234567890987654321234567890987654321');
l.convertToNumber()//1.2345678909876544e+54
```
**_setSign()_**
Returns the same number with changed the sign. (1 or '+' for positive and -1 or '-' for negative sign)
_Example_
```javascript
let u = new bigNumber('-213');
let v = u.setSign(1);
console.log(v.value);//213
```
**_compareAbs(number)_**
Returns 1 if the absolute value of the first number is greater than the second (passed as method parameter), 0 if is equal and -1 if is smaller
_Example_ 
```javascript
let f = new bigNumber(123)
f.compareAbs(-321);// -1
f.compareAbs(-123);//0
f.compareAbs(-120)//1
```
**_compare(number)_**
Returns 1 if the first number is greater from the second, 0 if is equals and -1 if is smaller
**_absGt(n)_ or _absoluteGreater(n)_**
Returns '''true''' if the first number is absolute bigger than the second and '''false''' otherwise
_Example_
```javascript
let a = new bigNumber('500');
a.absGt(-499);//true
a.absGt(500);//false
a.absGt(-600);//false
```
**_absGeq(n)_ or _absoluteGreaterOrEquals(n)_**
Returns '''true''' if the first number is absolute bigger or equals than the second and '''false''' otherwise
_Example_
```javascript
let a = new bigNumber('500');
a.absGeq(-499);//true
a.absGeq(500);//true
a.absGeq(-600);//false
```
**_absLt(n)_ or _absoluteLesser(n)_**
Returns '''true''' if the first number is lesser than the second and '''false''' otherwise
_Example_
```javascript
let a = new bigNumber(100);
a.absLt(190);//true
a.absLt(-120);//false
a.absLt(100);//false
```
**_absLeq(n)_ or _absoluteLesserOrEquals(n)_**
Returns '''true''' if the first number is lesser or equals than the second and '''false''' otherwise
_Example_
```javascript
let a = new bigNumber(100);
a.absLeq(190);//true
a.absLeq(-120);//false
a.absLeq(100);//true
```
**_absEq(n)_ or _absoluteEquals(n)_**
Returns '''true''' if the first number is absolute equals to the second and '''false''' otherwise
**_absNeq(n)_ or _absoluteNotEquals(n)_**
Returns true if the first number is not equals to the second and false otherwise
Similar behavior also have the methods: **_eq(n)_ or _equals(n)_**, **_lt(n)_ or _lesser(n)_**,**_gt(n)_ or _greater(n)_**, **_geq(n)_ or _greaterOrEquals(n)_**, **_leq(n)_ or _lesserOrEquals(n)_**, **_isEven()_** and **_isOdd()_**.

**_toBase(toBase, fromBase)_**
Convert a number from base with radix fromBase to base with radix toBase. By default the fromBase argument is equal to 10. The method returns bigNumber instance for radix <= 10 and string for radix > 10. To convert an number (in string type) with base greater than 10 use the function
 ```javascript
bigNumber.convertToDecimal(number) 
```  
_Example_
```javascript
let x = new bigNumber('12345678').toBase(8);
console.log(x);
=> bigNumber {
  value: '57060516',
  sign: '+',
  digits: 7,
  integer: '57060516',
  float: '0' 
  }
  let y = new bigNumber('1000000').toBase(64);
  console.log(y);
  '3Q90'
```
**_plus(n)_**
Returns the addition of the two numbers. The argument can be string, number or bigNumber type.
_Example_
```javascript
let a = new bigNumber('5567129807');
let b = new bigNumber('-12647786');
a.plus(b).plus('100').plus(-50);
=> bigNumber {
  value: '5554482071',
  sign: '+',
  digits: 9,
  integer: '5554482071',
  float: '0' }
```
**_minus(n)_**
Returns the sibstract between two mumbers (the bigNumber and the n).
_Example_
```javascript
let a = new bigNumber('342516709182');
a.minus('9876543212345');
=> bigNumber {
  value: '9534026503163',
  sign: '-',
  digits: 12,
  integer: '9534026503163',
  float: '0' 
  }
  ```
  **_times(n)_**
  Returns the product of two numbers (the big Number with the number n). The function uses implementation of Karatsuba algorithm.
  _Example_
  ```javascript
let a = new bigNumber('4453168985467234567656764577256885011399867');
a.times('-998112776998.13568755788997545678109432886932011547767912387');
=> bigNumber {
  value: '4444764862526672038487862634569782914040950755899945101.17515215074671594665844920445159552843079452529',
  sign: '-',
  digits: 102,
  integer: '4444764862526672038487862634569782914040950755899945101',
  float: '17515215074671594665844920445159552843079452529' 
  }
  ```
**_divide(n, precision)_**
Returns the division result between the bigNumber and the number n with precision selected from the user. If precision is not inserted, then by default is 10 (10 digits after the floating point).
The function uses the binary devision method. In the code are available also 'divide and conquer' division algorithms (recursionDivision and unbalancedDivision. For more details see: https://members.loria.fr/PZimmermann/mca/mca-0.4.pdf).
_Example_
```javascript
let a = new bigNumber('919283466198762342533777198111377160977127');
a.divide('9981127785789456765432178997897899775600922461.9432467567574')
```
**_divInt(n)_**
Returns the integer part from the division between two numbers.
_Example_
```javascript
let a = new bigNumber('1234567890')
   .divInt('987654321');
a.value;
=> '12'
```
**_mod(n)_**
Returns the reminder from the division between two numbers.
_Example_
```javascript
let a = new bigNumber('1234567890')
   .mod('98765432');
a.value;
=> '49382706'
```
**_factorial()_**
Returns the factorial of an integer.
```javascript
let a = new bigNumber(200).factorial();
a.value;
=>'788657867364790503552363213932185062295135977687173263294742533244359449963403342920304284011984623904177212138919638830257642790242637105061926624952829931113462857270763317237396988943922445621451664240254033291864131227428294853277524242407573903240321257405579568660226031904170324062351700858796178922222789623703897374720000000000000000000000000000000000000000000000000'
```
**_primesList()_**
Returns an array with prime numbers until to the big number.
_Example_
```javascript
let a = new bigNumber(30).primesList();
=> [ bigNumber { value: '2', sign: '+', digits: 0, integer: '2', float: '0' },
  bigNumber { value: '3', sign: '+', digits: 0, integer: '3', float: '0' },
  bigNumber { value: '5', sign: '+', digits: 0, integer: '5', float: '0' },
  bigNumber { value: '7', sign: '+', digits: 0, integer: '7', float: '0' },
  bigNumber { value: '11', sign: '+', digits: 1, integer: '11', float: '0' },
  bigNumber { value: '13', sign: '+', digits: 1, integer: '13', float: '0' },
  bigNumber { value: '17', sign: '+', digits: 1, integer: '17', float: '0' },
  bigNumber { value: '19', sign: '+', digits: 1, integer: '19', float: '0' },
  bigNumber { value: '23', sign: '+', digits: 1, integer: '23', float: '0' },
  bigNumber { value: '29', sign: '+', digits: 1, integer: '29', float: '0' } 
  ]
```
**_exp(precision)_**
Returns e^bigNumber
_Example_
```javascript
let a = new bigNumber(1).exp(30)
a.value
=> '2.718281828459045235360287471338'
```
## Bugs and other errors
If you find an error in the algorithms structure or bugs, you can refer it in exel_mmm@abv.bg
##License : MIT
