/**
 *  big numbers:
 */
'use strict';
let bigNumber = (function () {
    const base = 7, BASE = 1e7,
        isScientific = (num) => {
            let cpnum = new String(num);
            return cpnum.split('e').length === 2;
        },
        error = (msg) => {
            throw new Error(msg);
        },
        isFloat = (num) => {
            let cpnum = new String(num);
            if (isScientific(cpnum)) cpnum = normalizeNumber(cpnum);
            return cpnum.split('\.').length === 2;
        },
        isAccounting = (num) => {
            let cpnum = new String(num);
            return cpnum.split('\,').length > 1;
        },
        modifyAccountingToRealNumber = (num) => {
            let cpnum = new String(num);
            return cpnum.split('\,').join('');
        },
        removePoint = (num) => {
            let result = new String(num).split('\.').join('');
            return result;
        },
        addZerosRight = (num, count) => {
            let i, result = '';
            result += new String(num);
            for (i = 0; i < count; i++) result += 0;
            return result;
        },
        addZerosLeft = (num, count) => {
            let i, result = '';
            for (i = 0; i < count; i++) result += 0;
            result += new String(num);
            return result;
        },
        removeRedundantZeros = (num) => {
            let cpnum = new String(num);
            const len = cpnum.length;
            if (len === 1) return cpnum;
            if (cpnum[0] === '0' && cpnum[1] !== '\.') {
                cpnum = cpnum.substring(1, len);
                return removeRedundantZeros(cpnum);
            } else {
                if (cpnum[len - 1] === '0' && isFloat(num)) {
                    cpnum = cpnum.substring(0, len - 1);
                    if (cpnum[len - 2] === '.') cpnum = cpnum.substring(0, len - 2);
                    return removeRedundantZeros(cpnum);
                }
            }
            return cpnum;
        },
        getPointer = (num) => {
            const cpnum = new String(num),
                len = cpnum.length, index = cpnum.indexOf('\.');
            let pointer;
            pointer = index > -1 ? len - index - 1 : 0;
            return pointer;
        },
        putPointer = (num, point) => {
            let cpnum = new String(num);
            cpnum = point < cpnum.length ? cpnum : addZerosLeft(cpnum, point - cpnum.length + 1);
            const len = cpnum.length, index = len - point;
            if (point > 0) return cpnum.substring(0, index) + '\.' + cpnum.substring(index, len);
            else return cpnum + '.0';
        },
        normalizeNumber = (num) => {
            let cpnum = num ? new String(num) : new String(0);
            /**
             *  remove the sign if exist:
             */
            cpnum = cpnum[0] === '-' || cpnum[0] === '+' ? cpnum.substring(1, cpnum.length) : cpnum;
            if (isAccounting(cpnum)) cpnum = modifyAccountingToRealNumber(cpnum);
            if (isScientific(cpnum)) {
                if (!isNaN(cpnum.split('e')[0])) {
                    if (!isNaN(cpnum.split('e')[1])) {
                        if (Number(cpnum.split('e')[1]) > 0) {
                            cpnum = putPointer(addZerosRight(removePoint(cpnum.split('e')[0]), Number(cpnum.split('e')[1])), getPointer(cpnum.split('e')[0]));
                        }
                        if (Number(cpnum.split('e')[1]) < 0) {
                            cpnum = putPointer(addZerosLeft(removePoint(cpnum.split('e')[0]), Number(cpnum.split('e')[1])), getPointer(cpnum.split('e')[0]) - Number(cpnum.split('e')[1]));
                        }
                        if (Number(cpnum.split('e')[1]) === 0) {
                            cpnum = cpnum.split('e')[0];
                        }
                    }
                }
            }
            cpnum = removeRedundantZeros(cpnum);
            return cpnum.toString();
        },
        isCorrectNumber = (num) => {
            let cpnum = num ? new String(num) : new String(0);
            /**
             * check if num is number:
             */
            if (isNaN(cpnum)) {
                /**
                 * check if the error is because of accounting 
                 * modified number :
                 */
                if (cpnum.split('\,').length > 1) {
                    cpnum = cpnum.split('\,').join('');
                    return isCorrectNumber(cpnum);
                } else return false;
            }
            return true;
        };
    let ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_';
    let bigNumber = function bigNumber(number) {
        this.value = isCorrectNumber(number) ?
            normalizeNumber(number) :
            error("The number is not correctly inserted!");
        this.sign = new String(number)[0] === '-' ? '-' : '+';
        this.digits = (this.flioat === "0") ? this.value.length : this.value.length - 1;
        this.integer = this.value.split('\.')[0];
        this.float = this.value.split('\.')[1] || '0';
    }
    bigNumber.toBigNumber = (num) => {
        return num.constructor === bigNumber ?
            num.Number() : new bigNumber(num);
    }
    bigNumber.prototype.update = function () {
        return new bigNumber(this.sign + this.integer + '.' + this.float);
    }
    bigNumber.prototype.Number = function () {
        return new bigNumber(this.sign + this.value);
    }
    bigNumber.prototype.Digits = function () {
        return new bigNumber(this.digits);
    }
    bigNumber.prototype.Integer = function () {
        return new bigNumber(this.integer).setSign(this.sign);
    }
    bigNumber.prototype.Float = function () {
        return new bigNumber(this.float).setSign(this.sign);
    }
    bigNumber.prototype.convertToNumber = bigNumber.prototype.convertToJSNumber =function () {
        return Number(this.sign + this.value);
    }
    bigNumber.prototype.setSign = function (sign) {
        const isPositive = sign === '+' || sign === '' || sign === null || sign === '1' || sign === 1;
        const isNegative = sign === '-' || sign === '-1' || sign === -1;
        if (isPositive) this.sign = '+';
        else {
            if (isNegative) this.sign = '-';
            else throw new Error('incorrect sign declaration!!!');
        }
        return bigNumber.toBigNumber(this);
    };
    const compareAbs = (a, b) => {
        /**
         * see the library bigInteger of Peter Olson:
         * https://github.com/peterolson/BigInteger.js/blob/master/BigInteger.js
         */
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (let i = 0; i <= a.length - 1; i++) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    };
    bigNumber.prototype.compareAbs = function (n) {
        const m = bigNumber.toBigNumber(n),
            pInt = this.integer, pFloat = this.float,
            qInt = m.integer, qFloat = m.float;
        if (this.digits <= base && m.digits <= base) {
            if (Number(this.value) > Number(m.value)) return 1
            else if (Number(this.value) < Number(m.value)) return -1;
            return 0;
        } else {
            let compareIntParts = compareAbs(pInt, qInt),
                compareFloatParts = pFloat.length < qFloat.length ?
                    compareAbs(pFloat, qFloat.substring(0, pFloat.length)) !== 0 ?
                        compareAbs(pFloat, qFloat.substring(0, pFloat.length)) :
                        compareAbs('0', bigNumber.toBigNumber(qFloat.substring(pFloat.length - 1)).value) :
                    pFloat.length > qFloat.length ?
                        compareAbs(pFloat.substring(0, qFloat.length), qFloat) !== 0 ?
                            compareAbs(pFloat.substring(0, qFloat.length), qFloat) :
                            compareAbs('0', bigNumber.toBigNumber(pFloat.substring(qFloat.length - 1)).value) :
                        compareAbs(pFloat, qFloat);
            if (compareIntParts !== 0) return compareIntParts;
            else return compareFloatParts;
        }
    }
    const toBase_in_array = function toBaseOut(str, baseIn, baseOut) {
        if ((baseIn < 2 && baseIn > ALPHABET.length) || (baseOut < 2 && baseOut > ALPHABET.length))
            throw new Error('Invalid base!');
        var j,
            arr = [0],
            arrL,
            i = 0,
            len = str.length;

        for (; i < len;) {
            for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);
            arr[j = 0] += ALPHABET.indexOf(str.charAt(i++));

            for (; j < arr.length; j++) {

                if (arr[j] > baseOut - 1) {
                    if (arr[j + 1] == null) arr[j + 1] = 0;
                    arr[j + 1] += arr[j] / baseOut | 0;
                    arr[j] %= baseOut;
                }
            }
        }

        return arr.reverse();
    }
    bigNumber.prototype.compare = function (n) {
        if (n === 'Infinity' && this.value !== 'Infinity') return -1;
        if (n === '-Infinity' && this.value !== '-Infinity') return 1;
        let m = bigNumber.toBigNumber(n);
        return this.sign !== m.sign ? this.sign === '-' ? -1 : 1 : this.compareAbs(n) * (this.sign === '-' ? -1 : 1);
    }
    bigNumber.prototype.absGt = bigNumber.prototype.absoluteGreater = function (num) {
        return this.compareAbs(num) === 1;
    }
    bigNumber.prototype.absGeq = bigNumber.prototype.absoluteGreaterOrEquals = function (num) {
        return this.compareAbs(num) >= 0;
    }
    bigNumber.prototype.absLt = bigNumber.prototype.absoluteLesser = function (num) {
        return this.compareAbs(num) === -1;
    }
    bigNumber.prototype.absLeq = bigNumber.prototype.absoluteLesserOrEquals = function (num) {
        return this.compareAbs(num) <= 0;
    }
    bigNumber.prototype.absEq = bigNumber.prototype.absoluteEquals = function (num) {
        return this.compareAbs(num) === 0;
    }
    bigNumber.prototype.absNeq = bigNumber.prototype.absoluteNotEquals = function (num) {
        return this.compareAbs(num) !== 0;
    }
    bigNumber.prototype.equals = bigNumber.prototype.eq = function (num) {
        return this.compare(num) === 0;
    }
    bigNumber.prototype.notEquals = bigNumber.prototype.neq = function (num) {
        return this.compare(num) !== 0;
    }
    bigNumber.prototype.greater = bigNumber.prototype.gt = function (num) {
        return this.compare(num) === 1;
    }
    bigNumber.prototype.greaterOrEquals = bigNumber.prototype.geq = function (num) {
        return this.compare(num) >= 0;
    }
    bigNumber.prototype.lesser = bigNumber.prototype.lt = function (num) {
        return this.compare(num) === -1;
    }
    bigNumber.prototype.lesserOrEquals = bigNumber.prototype.leq = function (num) {
        return this.compare(num) <= 0;
    }
    bigNumber.prototype.isEven = function () {
        return this.float === '0' ? (this.integer[this.integer.length - 1] & 1) === 0 : false;
    }
    bigNumber.prototype.isOdd = function () {
        return this.float === '0' ? (this.integer[this.integer.length - 1] & 1) === 1 : false;
    }
    bigNumber.prototype.toBase_in_array = function (toBase, fromBase) {
        fromBase = fromBase || 10;
        return toBase_in_array(this.value, fromBase, toBase);
    }
    bigNumber.prototype.toBase = function (toBase, fromBase) {
        fromBase = fromBase || 10;
        let result = toBase_in_array(this.value, fromBase, toBase)
            .map(el => {
                return ALPHABET[el];
            }).join('')
        return toBase <= 10 ? new bigNumber(result) : result;
    }
    bigNumber.convertToDecimal = function (n, fromBase) {
        if (!fromBase) error ("Error : fromBase argument is not inserted!")
        return new bigNumber(toBase_in_array(n, fromBase, 10).join(''));   
    }
    const addSmallNumbers = (a1, a2) => {
        /**
         * a1 have to be larger than a2!!!
         * a1 and a2 have to be bigNumber type!!!
         */
        return new bigNumber(a1.convertToNumber() + a2.convertToNumber());
    }
    const addSingleNumber = (num, digit) => {
        let len = num.length, i = len - 1;
        const addi = (num, i, digit) => {
            let di = new String(Number(num[i]) + Number(digit)), carry;
            if (di.length === 1) {
                num = num.substring(0, i) + di + num.substring(i + 1);
                return num;
            } else {
                carry = di[0];
                num = num.substring(0, i) + di[1] + num.substring(i + 1);
                i -= 1;
                if (i === 0) {
                    num = di + num.substring(i + 1);
                    return num;
                }
                return addi(num, i, carry);
            }
        }
        return addi(num, i, digit);
    }
    const split_at = (num, index) => {
        return [
            num.substring(0, num.length - index) === '' ? "0" : num.substring(0, num.length - index),
            num.substring(num.length - index)
        ];
    }
    const split_to = (str, index) => {
        const fp = '(?=(?:', sp = ')*$)';
        let parts = '', i = index, regexp;
        while (i) {
            parts += '\.';
            --i;
        }
        regexp = fp + parts + sp;
        regexp = new RegExp(regexp);
        return str.split(regexp);
    }
    const subtractSingleNumber = (num, digit) => {
        const len = num.length;
        let cpnum = new String(num), temp,
            i = len - 1, carry = Number(digit), fp, sp;
        while (i + 1) {
            fp = cpnum.substring(0, i);
            sp = cpnum.substring(i + 1);
            if (Number(cpnum[i]) < carry) {
                temp = new String(Number('1'.concat(cpnum[i])) - carry);
                cpnum = fp.concat(temp).concat(sp);
                carry = 1;
                --i;
            } else {
                temp = new String(Number(cpnum[i]) - carry);
                cpnum = fp.concat(temp).concat(sp);
                break;
            }
        }
        return new bigNumber(cpnum);
    }
    const subtractBigIntegers = (a, b) => {
        /**
         * initialization: (a and b is assumed like integers)
         */
        a = bigNumber.toBigNumber(a);
        b = bigNumber.toBigNumber(b);
        /**
         * order the two integer numbers by the length:
         */
        let n1, n2;
        if (a.sign === b.sign) {
            if (a.absGt(b)) {
                n1 = a;
                n2 = b;
            } else {
                if (a.absLt(b)) {
                    n1 = b;
                    n2 = a;
                } else return new bigNumber("0");
            }
            /**
             * split the numbers to the base:
             */
            let n1_splited_to_base = split_to(n1.value, base),
                n2_splited_to_base = split_to(n2.value, base);
            const n1_splited_len = n1_splited_to_base.length,
                n2_splited_len = n2_splited_to_base.length;
            let n2i = n2_splited_len - 1, n1i = n1_splited_len - 1, diff = n1i - n2i, result = '', temp, carry = 0;
            while (n1i + 1) {
                if (n1i >= diff) {
                    if (n1_splited_to_base[n1i] - carry - n2_splited_to_base[n2i] < 0) {
                        temp = 1 + n1_splited_to_base[n1i] - carry - n2_splited_to_base[n2i];
                        result = (temp.toString().length < base ?
                            addZerosLeft(temp, base - temp.toString().length) :
                            temp) + result;
                        carry = 1;
                    } else {
                        temp = n1_splited_to_base[n1i] - carry - n2_splited_to_base[n2i];
                        result = (temp.toString().length < base ?
                            addZerosLeft(temp, base - temp.toString().length) :
                            temp) + result;
                        carry = 0;
                    }
                } else {
                    if (n1_splited_to_base[n1i] - carry < 0) {
                        temp = 1 + n1_splited_to_base[n1i] - carry;
                        result = (temp.toString().length < base && n1i !== 0 ?
                            addZerosLeft(temp, base - temp.toString().length) :
                            temp) + result;
                        carry = 1;
                    } else {
                        temp = n1_splited_to_base[n1i] - carry;
                        result = (temp.toString().length < base && n1i !== 0 ?
                            addZerosLeft(temp, base - temp.toString().length) :
                            temp) + result;
                        for (let i = 0; i < n1i; i++) result = n1_splited_to_base[i] + result;
                        break;
                    }
                }
                --n1i;
                --n2i;
            }
            if (n1.sign === '+') {
                if (a.gt(b)) return new bigNumber(result);
                else return new bigNumber(result).setSign(-1);
            }
            else {
                if (a.lt(b)) return new bigNumber(result).setSign(-1);
                else return new bigNumber(result);
            }
        } else {
            if (n1.sign === '+') return addBigIntegers(n1, n2.setSign(-1));
            else return addBigIntegers(n1.setSign(-1), n2);
        }
        /**
         *  -1 1    -1 1
         *  12|0000000|4000005
         * -
         *    |5965439|9299887
         * ---------------------
         */
    }
    const addBigIntegers = (a, b) => {
        /**
         * step 1: order the two numbers:
         */
        let n1, n2;
        if (bigNumber.toBigNumber(a).absGeq(bigNumber.toBigNumber(b))) {
            n1 = bigNumber.toBigNumber(a);
            n2 = bigNumber.toBigNumber(b)
        } else {
            n1 = bigNumber.toBigNumber(b);
            n2 = bigNumber.toBigNumber(a);
        }
        /**
         * step 2: check if the numbers are both positive or negative 
         */
        if (n1.sign === n2.sign) {
            /**
             * step 3: define the addition for small numbers:
             */
            if (n1.digits <= base) {
                return addSmallNumbers(n1, n2);
            }
            /**
             * step 4: split the bigger number in the middle
             * and define the sum recurrently:
             */
            const m2 = Math.ceil(n1.digits / 2);
            let split_n1 = split_at(n1.value, m2),
                split_n2 = split_at(n2.value, m2), a1,
                a2 = bigNumber.toBigNumber(split_n1[1]).setSign(n1.sign),
                b2 = split_n2[0] !== '' ? bigNumber.toBigNumber(split_n2[1]).setSign(n2.sign) :
                    bigNumber.toBigNumber(split_n2[0]).setSign(n2.sign),
                b1 = split_n2[0] !== '' ? bigNumber.toBigNumber(split_n2[0]).setSign(n2.sign) :
                    bigNumber.toBigNumber('0');
            let sum2 = addBigIntegers(a2, b2).value;
            a1 = split_n1[0];
            if (sum2.length < split_n1[1].length) sum2 = addZerosLeft(sum2, split_n1[1].length - sum2.length);
            if (sum2.length > split_n1[1].length) {
                const split_sum2 = split_at(sum2, split_n1[1].length);
                sum2 = split_sum2[1];
                a1 = addSingleNumber(split_n1[0], split_sum2[0]);
            }
            let sum1 = addBigIntegers(a1, b1).value;
            let sum = bigNumber.toBigNumber(sum1.concat(sum2));
            return n1.sign === "+" ? sum : sum.setSign(-1);
        } else {
            /**
             * step 5: if has negative number
             * make subtraction of n1 and n2:
             */
            if (n1.sign === '-') return subtractBigIntegers(n1.setSign(1), n2).setSign(-1);
            else return subtractBigIntegers(n1, n2.setSign(1));
        }
    }
    const sumOfBigNumbers = (arr) => {
        let i = arr.length,
            tbn = (num) => { return bigNumber.toBigNumber(num); },
            suma = bigNumber.toBigNumber(0);
        while (i--) {
            suma = suma.plus(arr[i]);
        }
        return suma;
    }
    const constantMultiply = (a, c) => {
        if (c.eq(0)) return new bigNumber(0);
        if (c.eq(1)) return a;
        let a_splited = split_to(a.value, base);
        let ac_splited = a_splited.map((el, i) => { return addZerosRight(el * c.value, base * (a_splited.length - i - 1)); });
        return bigNumber.sum(ac_splited);
    }
    const karatsuba = (a, b) => {
        /**
         * initialization:
         */
        a = bigNumber.toBigNumber(a);
        b = bigNumber.toBigNumber(b);
        let n1 = a.absGeq(b) ? a : b,
            n2 = a.absLt(b) ? a : b,
            n1_splited, n2_splited, n11_plus_n12, n21_plus_n22,
            z1, z2, z3, z4, firstPart, secondPart, secondPartCarry,
            thirdPart, thirdPartCarry;
        /**
         * clean the zeros in the end of the two numbers 
         * and add them in the final result
         */
        let zerosab = '', n1ii = n1.integer.length - 1, n2ii = n2.integer.length - 1;
        while (n1ii && n1.integer[n1ii] === '0') {
            n1.integer = n1.integer.substring(0, n1ii);
            zerosab += '0';
            --n1ii;
        }
        while (n2ii && n2.integer[n2ii] === '0') {
            n2.integer = n2.integer.substring(0, n2ii);
            zerosab += '0';
            --n2ii;
        }
        n1 = n1.update();
        n2 = n2.update();
        /**
         * define the multiplication of small numbers:
         */
        if (n1.digits <= base - 1 && n2.digits <= base - 1) return new bigNumber((n1.convertToNumber() * n2.convertToNumber()) + zerosab);

        if (n1.digits > base - 1 && n2.digits <= base - 1) return new bigNumber(constantMultiply(n1, n2).value + zerosab);
        /**
         * define the multiplication of big numbers:
         */
        const m2 = Math.ceil(n1.digits / 2);
        n1_splited = split_at(n1.value, m2);
        n2_splited = split_at(n2.value, m2);
        n11_plus_n12 = addBigIntegers(n1_splited[0], n1_splited[1]);
        n21_plus_n22 = addBigIntegers(n2_splited[0], n2_splited[1]);
        z1 = karatsuba(n11_plus_n12, n21_plus_n22);
        z2 = karatsuba(n1_splited[0], n2_splited[0]);
        //console.log(z2)
        z3 = karatsuba(n1_splited[1], n2_splited[1]);
        z4 = subtractBigIntegers(z1, addBigIntegers(z2, z3));
        /*[thirdPartCarry, thirdPart] = split_at(z3.value, m2);
        [secondPartCarry, secondPart] = split_at(addBigIntegers(z4.value, thirdPartCarry).value, m2);
        firstPart = addBigIntegers(z2.value, secondPartCarry).value;*/
        let res = addBigIntegers(addBigIntegers(addZerosRight(z2.value, 2 * m2), addZerosRight(z4.value, m2)), z3.value);
        //return new bigNumber(firstPart.concat(secondPart).concat(thirdPart).concat(zerosab));
        return new bigNumber(res.value + zerosab);
    }
    const basecaseDivRem = (a, b) => {
        a = bigNumber.toBigNumber(a),
            b = bigNumber.toBigNumber(b);
        let A, B;
        if (a.absGeq(b)) {
            A = bigNumber.toBigNumber(a);
            B = bigNumber.toBigNumber(b);
        } else {
            return {
                Q: new bigNumber(0),
                R: bigNumber.toBigNumber(a)
            }
        }
        if (A.digits <= base && B.digits <= base) {
            return {
                Q: new bigNumber(A.value / B.value | 0),
                R: new bigNumber(A.value % B.value)
            };
        }
        let m = A.digits - B.digits, i = m, q = new Array(), qStar;
        if (m !== 0) {
            while (i) {
                qStar = (A.value[0] + A.value[1]) / B.value[0] | 0;
                q[i] = qStar;
                A = A.minus(addZerosRight(B.times(q[i]).value, (i - 1)));
                while (A.lesser(0)) {
                    --q[i];
                    A = A.plus(addZerosRight(B.value, (i - 1)));
                }
                --i;
            }
        } else {
            qStar = A.value[0] / B.value[0] | 0;
            A = A.minus(B.times(qStar));
            while (A.lt(0)) {
                --qStar;
                A = A.plus(B)
            }
            q[0] = qStar;
        }
        return {
            Q: new bigNumber(q.reverse().join('')),
            R: A
        };
    }
    const recursiveDivRem = (a, b) => {
        /**
         * Initialization:
         */
        let A, B, i, B1, B0, Q1, Q0, R1, R0,
            Aprim, Asec, k, m, QR1, Adiv2k, Amod2k,
            QR0, AprimDiv1k, AprimMod1k;
        /**
         * Check if the diviсor is smaller than the divident: 
         * if yes --> copy the numbers like bigNumbers 
         * and start the division procedure
         * if No --> if they are equals return Q : 1 and R : 0
         *           else return Q : 0 and R : a 
         */
        if (bigNumber.toBigNumber(a).absGt(bigNumber.toBigNumber(b))) {
            A = bigNumber.toBigNumber(a);
            B = bigNumber.toBigNumber(b);
        } else {
            if (bigNumber.toBigNumber(a).absEq(bigNumber.toBigNumber(b))) {
                return {
                    Q: new bigNumber(1),
                    R: new bigNumber(0)
                }
            }
            else {
                return {
                    Q: new bigNumber(0),
                    R: bigNumber.toBigNumber(a)
                }
            }
        }
        m = A.digits - B.digits;
        if (m < 2) return basecaseDivRem(A, B);
        k = m / 2 | 0;
        [B1, B0] = split_at(B.value, k);
        [Adiv2k, Amod2k] = split_at(A.value, 2 * k);
        QR1 = recursiveDivRem(Adiv2k, B1);
        [Q1, R1] = [QR1.Q, QR1.R];
        Aprim = new bigNumber(addZerosRight(R1.value, 2 * k)).plus(Amod2k).minus(addZerosRight(Q1.times(B0).value, k));
        while (Aprim.lt(0)) {
            Q1 = Q1.minus(1);
            Aprim = Aprim.plus(addZerosRight(B.value, k));
        }
        [AprimDiv1k, AprimMod1k] = split_at(Aprim.value, k);
        QR0 = recursiveDivRem(AprimDiv1k, B1);
        [Q0, R0] = [QR0.Q, QR0.R];
        Asec = new bigNumber(addZerosRight(R0.value, k)).plus(AprimMod1k).minus(Q0.times(B0));
        while (Asec.lt(0)) {
            Q0 = Q0.minus(1);
            Asec = Asec.plus(B);
        }
        return {
            Q: new bigNumber(addZerosRight(Q1.value, k)).plus(Q0),
            R: Asec
        };
    }
    const unbalancedDivision = (a, b) => {
        let A = bigNumber.toBigNumber(a), Q = new bigNumber(0),
            B = bigNumber.toBigNumber(b), m = A.digits - B.digits, n = B.digits, q, r, qr1, qr2, A1, A0;
        while (m > n) {
            [A1, A0] = split_at(A.value, m - n);
            qr1 = basecaseDivRem(A1, B);
            [q, r] = [qr1.Q, qr1.R];
            Q = new bigNumber(addZerosRight(Q.value, n)).plus(q);
            A = new bigNumber(addZerosRight(r.value, m - n)).plus(A0);
            m -= n;
        }
        qr2 = recursiveDivRem(A, B);
        [q, r] = [qr2.Q, qr2.R];
        return {
            Q: new bigNumber(addZerosRight(Q.value, m)).plus(q),
            R: r
        }
    }
    const binaryDivision = (a, b) => {
        let abin = bigNumber.toBigNumber(a).toBase(2),
            bbin = bigNumber.toBigNumber(b).toBase(2),
            q = Array.from({ length: abin.value.length }).map(elem => { return elem = "0" }), r = ["0"], i;
        if (bbin.eq(0)) throw new Error("Division by zero error!!!");
        if (abin.lt(bbin)) return { Q: new bigNumber(0), R: bigNumber.toBigNumber(a) };
        if (abin.absEq(bbin)) return { Q: new bigNumber(1), R: new bigNumber(0) };
        let [N, D, n] = [abin.value.split(''), bbin.value.split(''), abin.value.length];
        i = n - 1;
        do {
            r.push("0");
            r[r.length - 1] = N[n - 1 - i];
            if (new bigNumber(r.join('')).geq(D)) {
                r = new bigNumber(r.join('')).toBase(10, 2).minus(b).toBase(2).value.split('');
                q[q.length - i - 1] = "1";
            }
        } while (i--);
        return { Q: new bigNumber(q).toBase(10, 2), R: new bigNumber(r).toBase(10, 2) }
    }
    const exactDivision = (a, b, precision) => {
        /**
         * this function assumes that a and b are both 
         * bigNumber type and calculate the divident
         * for a given precision. 
         */
        let pointA = a.float === '0' ? 0 : a.float.length,
            pointB = b.float === '0' ? 0 : b.float.length, m = pointA - pointB,
            a1a0 = a.integer + (m < 0 ? addZerosRight(a.float, a.float === '0' ? -m - 1 : -m) : m === 0 ? '' : a.float),
            b1b0 = b.integer + (m > 0 ? addZerosRight(b.float, b.float === '0' ? m - 1 : m) : m === 0 ? '' : b.float);
        precision = !isNaN(precision) ? Number(precision) : 10;

        /**
         * divide the integer numbers a1a0 and b1b0:
         */
        let AdivB = binaryDivision(a1a0, b1b0);
        let result = AdivB.Q, rem = AdivB.R, i = precision;
        result.float === '0' ? result.float = '' : result.float;
        while (rem.neq(0) && i) {
            rem = addZerosRight(rem.value, 1);
            result.float += binaryDivision(rem, b1b0).Q.value;
            rem = binaryDivision(rem, b1b0).R;
            --i;
        }
        return result.update();
    }
    const pow = (a, n) => {
        let m = bigNumber.toBigNumber(n);
        let x = bigNumber.toBigNumber(a), y;
        if (m.lt(0)) {
            x = new bigNumber(1).divide(a);
            m = m.times(-1);
        }
        if (m.eq(0)) return new bigNumber(1);
        y = new bigNumber(1);
        while (1) {
            if (m.isOdd()) {
                y = y.times(x);
                m = m.minus(1);
            }
            if (m.eq(0)) break;
            x = x.times(x);
            m = m.divide(2)
        }
        return y;
    }
    const primesSmall = (limit) => {
        const bn = (tbn) => {
            return bigNumber.toBigNumber(tbn);
        };
        let sqr_lim, is_prime = new Array(limit + 1), x2, y2, i, j, n, primes_arr = new Array();
        sqr_lim = parseInt(Math.sqrt(limit));
        for (i = 0; i <= limit; i++) is_prime[i] = false;
        is_prime[2] = true;
        is_prime[3] = true;
        x2 = 0;
        for (i = 1; i <= sqr_lim; i++) {
            x2 += 2 * i - 1;
            y2 = 0;
            for (j = 1; j <= sqr_lim; j++) {
                y2 += 2 * j - 1;

                n = 4 * x2 + y2;
                if ((n <= limit) && (n % 12 == 1 || n % 12 == 5))
                    is_prime[n] = !is_prime[n];

                // n = 3 * x2 + y2; 
                n -= x2;
                if ((n <= limit) && (n % 12 == 7))
                    is_prime[n] = !is_prime[n];
                n -= 2 * y2;
                if ((i > j) && (n <= limit) && (n % 12 == 11))
                    is_prime[n] = !is_prime[n];
            }
        }
        for (i = 5; i <= sqr_lim; i++) {
            if (is_prime[i]) {
                n = i * i;
                for (j = n; j <= limit; j += n) {
                    is_prime[j] = false;
                }
            }
        }
        primes_arr.push(bn(2), bn(3), bn(5));
        for (i = 6; i <= limit; i++) {
            if ((is_prime[i]) && (i % 3 != 0) && (i % 5 != 0)) {
                primes_arr.push(bn(i))
            }
        }
        return primes_arr;
    }
    const primesBig = (limit) => {
        /**
         * limit is assumed to be bigNumber type!
         */
        /**
         * initializations:
         */
        const bn = (tbn) => {
            return bigNumber.toBigNumber(tbn);
        };
        let i = bn(0), j, a, x = bn(1), y = bn(1), n, r = bn(5), primes_arr = new Array(), sieve;
        /**
         * 2 and 3 are known to be prime: 
         */
        if (limit.gt(2)) primes_arr.push(bn(2));
        if (limit.gt(3)) primes_arr.push(bn(3));
        sieve = new Array(limit.convertToNumber());
        while (i.lt(limit)) {
            sieve[i.convertToNumber()] = false;
            i = i.plus(1);
        }
        for (x = bn(1); x.pow(2).lt(limit); x = x.plus(1)) {
            for (y = bn(1); y.pow(2).lt(limit); y = y.plus(1)) {
                n = x.pow(2).times(4).plus(y.pow(2));
                if (n.leq(limit) && (n.mod(12).value === '1' || n.mod(12).value === '5')) {
                    sieve[n.convertToNumber()] ^= true;
                }
                n = x.pow(2).times(3).plus(y.pow(2));
                if (n.leq(limit) && n.mod(12).value === '7') sieve[n.convertToNumber()] ^= true;
                n = x.pow(2).times(3).minus(y.pow(2));
                if (x.gt(y) && n.leq(limit) && n.mod(12).value === '11') sieve[n.convertToNumber()] ^= true;
            }
        }
        while (r.pow(2).lt(limit)) {
            if (sieve[r.convertToNumber()]) {
                j = r.pow(2);
                while (j.lt(limit)) {
                    sieve[j.convertToNumber()] = false;
                    j = j.plus(r.pow(2))
                }
            }
            r = r.plus(1);
        }
        for (a = bn(5); a.lt(limit); a = a.plus(1)) {
            if (sieve[a.convertToNumber()]) primes_arr.push(a);
        }
        return primes_arr;
    }
    const recursionFactorial = (n) => {
        let N, bits;
        const product = (m, len) => {
            if (len === 1) return m;
            if (len === 2) return m.times(m.minus(2));
            let hlen = len / 2 | 0;
            return product(m.minus(hlen * 2), len - hlen).times(product(m, hlen));
        }
        const odd_factorial = (n) => {
            let sqrOddFact = new bigNumber(1), smallOddSwing = [
                1, 1, 1, 3, 3, 15, 5, 35, 35, 315, 63, 693, 231, 3003, 429, 6435, 6435,
                109395, 12155, 230945, 46189, 969969, 88179, 2028117, 676039, 16900975,
                1300075, 35102025, 5014575, 145422675, 9694845, 300540195, 300540195],
                smallOddFactorial = [
                    1, 1, 1, 3, 3, 15, 45, 315, 315, 2835, 14175, 155925, 467775, 6081075,
                    42567525, 638512875, 638512875], oddSwing, oddFact, oldOddFact, len, high;
            if (n.lt(17)) {
                oddFact = new bigNumber(smallOddFactorial[n.value]);
                sqrOddFact = new bigNumber(smallOddFactorial[n.divInt(2).value]);
            } else {
                [sqrOddFact, oldOddFact] = odd_factorial(n.divInt(2));
                if (n.lt(33)) oddSwing = smallOddSwing[n.value];
                else {
                    len = n.minus(1).divInt(4).convertToNumber();
                    if (n.mod(4).neq(2)) len += 1;
                    high = n.minus(n.plus(1).mod(2));
                    oddSwing = product(high, len).divInt(oldOddFact);
                }
                oddFact = sqrOddFact.pow(2).times(oddSwing)
            }
            return [oddFact, sqrOddFact]
        }
        if (n.eq(0)) return new bigNumber(1);
        if (n.eq(0)) return new bigNumber(0);
        [N, bits] = [bigNumber.toBigNumber(n), bigNumber.toBigNumber(n)];
        while (N.neq(0)) {
            bits = bits.minus(N.mod(2));
            N = N.divInt(2);
        }
        let F = odd_factorial(n);
        return F[0].times(new bigNumber(2).pow(bits))
    }
    const conventionalFactorial = (n) => {
        let m = bigNumber.toBigNumber(n), res = new bigNumber(1);
        while (m.geq(2)) {
            res = res.times(m);
            m = m.minus(1);
        }
        return res;
    }
    bigNumber.prototype.plus = function (a) {
        a = bigNumber.toBigNumber(a);
        if (this.float === "0" && a.float === "0") return addBigIntegers(this, a);
        else {
            if (this.sign !== a.sign) {
                if (this.sign === '-') return a.minus(this);
                else return this.minus(a);
            } else {
                let maxDigits = this.float.length > a.float.length ? this.float.length : a.float.length;
                let na = this.integer + addZerosRight(this.float, maxDigits - this.float.length);
                let nb = a.integer + addZerosRight(a.float, maxDigits - a.float.length);
                let sum = new bigNumber(putPointer(addBigIntegers(na, nb).value, maxDigits));
                return sum.setSign(this.sign);
            }
        }
    }
    bigNumber.prototype.minus = function (a) {
        a = bigNumber.toBigNumber(a);
        if (this.float !== '0' || a.float !== '0') {
            if (this.sign !== a.sign) {
                return this.plus(a.setSign(-1));
            } else {
                if (this.sign === '-') return a.setSign(1).minus(this.setSign(1));
                else {
                    /**
                     * straighten the float parts
                     * remove the float points and make subraction of big integers
                     * put the float point in the correct place
                     * 
                     */
                    const addZeros = this.Float().digits > a.float.length ? this.float.length : a.float.length;
                    let na = this.integer + addZerosRight(this.float, addZeros - this.float.length),
                        nb = a.integer + addZerosRight(a.float, addZeros - a.float.length);
                    let naminusnb = subtractBigIntegers(na, nb);
                    return new bigNumber(putPointer(naminusnb.value, addZeros)).setSign(naminusnb.sign);
                }
            }
        }
        return subtractBigIntegers(this, a);
    }
    bigNumber.sum = function (arr) {
        return sumOfBigNumbers(arr);
    }
    bigNumber.prototype.times = function (a) {
        let A = bigNumber.toBigNumber(this),
            B = bigNumber.toBigNumber(a), pointA, pointB, AIAF, BIBF, _AB_, AB;
        if (A.float === '0' && B.float === '0') AB = karatsuba(A, B);
        else {
            if (A.float !== "0") {
                pointA = A.float.length;
                AIAF = (A.integer === '0' ? '' : A.integer) + A.float;
            }
            else {
                pointA = 0;
                AIAF = A.integer;
            }
            if (B.float !== "0") {
                pointB = B.float.length;
                BIBF = (B.integer === '0' ? '' : B.integer) + B.float;
            }
            else {
                pointB = 0;
                BIBF = B.integer;
            }
            _AB_ = karatsuba(AIAF, BIBF);
            _AB_ = putPointer(_AB_.value, pointA + pointB)
            AB = new bigNumber(_AB_);
        }
        if (A.sign === B.sign) return AB
        else return AB.setSign(-1);
    }
    bigNumber.prototype.pow = function (n) {
        return pow(this, n);
    }
    bigNumber.prototype.divide = function (a, precision) {
        a = bigNumber.toBigNumber(a);
        if (this.sign === a.sign) return exactDivision(this, a, precision);
        else return exactDivision(this, a, precision).setSign(-1);
    }
    bigNumber.prototype.ln = function (precision, digits) {
        precision = Number(precision) || 1e-10, digits = Number(digits) || 10;
        let sum = new bigNumber(0),
            pow = new bigNumber(1),
            member_i = pow,
            x = this.minus(1).divide(this.plus(1)), i = 0, j = 2 * i + 1;
        while (member_i.geq(precision)) {
            while (j--) pow = pow.times(x);
            member_i = pow.divide(2 * i + 1, digits);
            sum = sum.plus(member_i);
            j = 2;
            ++i;
        }
        return sum.times(2);
    }
    bigNumber.prototype.gammaln = function (n) {
        n = bigNumber.toBigNumber(n);
        let x, y, tmp, ser, j;
        let cof = [
            76.18009172947146,
            -86.50532032941677,
            24.01409824083091,
            -1.231739572450155,
            0.1208650973866179e-2,
            -0.5395239384953e-5];
        x = y = n;
        tmp = x.plus(5.5);
        tmp = tmp.minus(x.plus(0.5).times(tmp.ln()));
        ser = new bigNumber(1.000000000190015);
        for (j = 0; j <= 5; j++) {
            y = y.plus(1);
            ser = ser.plus(new bigNumber(cof[j].divide(y)));
        }
        return tmp.times(-1).plus(ser.times(2.5066282746310005).divide(x).ln());
    }
    bigNumber.prototype.divInt = function (n) {
        let m = bigNumber.toBigNumber(n);
        return binaryDivision(this, m).Q;
    }
    bigNumber.prototype.mod = function (n) {
        let m = bigNumber.toBigNumber(n);
        return binaryDivision(this, m).R;
    }
    bigNumber.prototype.factorial = function () {
        return recursionFactorial(this);
    }
    bigNumber.prototype.exp = function (p) {
        p = p ? bigNumber.toBigNumber(p) : new bigNumber(10);
        let eps = new bigNumber(10).pow(p.times(-1));
        let sum = new bigNumber(0), pow = new bigNumber(1),
            k = new bigNumber(0);
        while (pow.gt(eps)) {
            pow = k.plus(1).divide(k.times(2).plus(1).factorial(), p.value);
            sum = sum.plus(pow);
            k = k.plus(1);
        }
        return sum.times(2).pow(this);
    }
    bigNumber.prototype.primesList = function () {
        if (this.float === '0') return primesSmall(this.convertToNumber());
        else return primesSmall(this.Integer().convertToNumber());
    }
    return bigNumber;
})();
