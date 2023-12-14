import { forEach } from "lodash";

export const lengthOne = (text: string) => {
    let numberRepetitions = 0;
    let repeatingCharacters = "";

    for (let i = 0; i <= text.length; ++i) {
        if(text.charAt(i) === text.charAt(i+1)) {
            numberRepetitions++;
        } else {
            repeatingCharacters += (numberRepetitions ? numberRepetitions + 1 : '1') + text.charAt(i);
            numberRepetitions = 0;
        }
    }

    let newRepeatingCharacters = "";

    for (let i = 0; i <= repeatingCharacters.length; i = i+2) {
        const count = Number(repeatingCharacters.charAt(i));

        for (let j = 0; j < count; ++j) {
            newRepeatingCharacters = newRepeatingCharacters + repeatingCharacters.charAt(i+1);
        }
    }

    return {
        coding: repeatingCharacters,
        decoding: newRepeatingCharacters,
        bitDo: new Blob([text]).size * 8,
        bitPosle: new Blob([repeatingCharacters]).size * 8,
        compressiya: Math.round(((new Blob([text]).size * 8) - (new Blob([repeatingCharacters]).size * 8))/(new Blob([text]).size * 8) * 100),
    }
}

export const lengthTwo = (text: string) => {
    let numberRepetitions = 0;
    let repeatingCharacters = "";
    let str = "";

    for (let i = 0; i <= text.length; i = i + 2) {
        if(text.charAt(i) + text.charAt(i+1) == text.charAt(i+2) + text.charAt(i+3)) {
            numberRepetitions++
        } else {
            repeatingCharacters += (numberRepetitions ? numberRepetitions + 1 : '1') + text.charAt(i) + text.charAt(i+1);
            str += numberRepetitions + 1 + " ";
            numberRepetitions = 0;
        }
    }

    let newRepeatingCharacters = "";
    console.log("str", str);

    const arr = str.split(" ");
    const newArr: Array<number> = [];

    arr.forEach((val) => {
        console.log("val", Number(val));
        
        if(Number(val) > 0) {
            newArr.push(Number(val))
        }
    })

    console.log("newArr", newArr);


    newRepeatingCharacters = "";
    let saveCount = 0;
    newArr.forEach((count, index) => {
        let num = 1;
            if(count > 9) {
                num = 2;
            }

        if(index === 0) {
            console.log("test", text.slice(num + index, count * 2 - 1));
            
            newRepeatingCharacters += text.slice(num, count * 2);
            saveCount = count;
        } else {
            console.log("test", 2 * (num + saveCount));
            newRepeatingCharacters += text.slice(2 * (saveCount));
        }
        
    })
    
    // for(let a = 0; a < newArr.length; a++) {
    //     let num = 3;
    //     console.log(a);
        
    //     if(a > 9) {
    //         num += 4;
    //     }

    //     for (let i = 0; i <= repeatingCharacters.length; i = i+num) {
    //         const count = Number(repeatingCharacters.charAt(i));
    
    //         for (let j = 0; j < count; ++j) {
    //             newRepeatingCharacters = newRepeatingCharacters + repeatingCharacters.charAt(i+1) + repeatingCharacters.charAt(i+2);
    //         }
    //     }
    // }

    return {
        coding: repeatingCharacters,
        decoding: newRepeatingCharacters,
        bitDo: new Blob([text]).size * 8,
        bitPosle: new Blob([repeatingCharacters]).size * 8,
        compressiya: Math.round(((new Blob([text]).size * 8) - (new Blob([repeatingCharacters]).size * 8))/(new Blob([text]).size * 8) * 100),
    }
}

export const lengthThird = (text: string) => {
    let numberRepetitions = 0;
    let repeatingCharacters = "";

    for (let i = 0; i <= text.length; i = i + 3) {
        if(text.charAt(i) + text.charAt(i+1) + text.charAt(i+2) == text.charAt(i+3) + text.charAt(i+4) + text.charAt(i+5)) {
            numberRepetitions++;
        } else {
            repeatingCharacters += (numberRepetitions ? numberRepetitions + 1 : '1') + text.charAt(i) + text.charAt(i+1) + text.charAt(i+2);
            numberRepetitions = 0;
        }
    }

    let newRepeatingCharacters = "";

    for(let i = 0; i <= repeatingCharacters.length; i = i + 4) {
        const count = Number(repeatingCharacters.charAt(i));

        for (let j = 0; j < count; ++j) {
            newRepeatingCharacters = newRepeatingCharacters + repeatingCharacters.charAt(i+1) + repeatingCharacters.charAt(i+2) + repeatingCharacters.charAt(i+3);
        }
    }

    return {
        coding: repeatingCharacters,
        decoding: newRepeatingCharacters,
        bitDo: new Blob([text]).size * 8,
        bitPosle: new Blob([repeatingCharacters]).size * 8,
        compressiya: Math.round(((new Blob([text]).size * 8) - (new Blob([repeatingCharacters]).size * 8))/(new Blob([text]).size * 8) * 100),
    }
}

export const lengthFour = (text: string) => {
    let numberRepetitions = 0;
    let repeatingCharacters = "";

    for (let i=0; i <= text.length; i = i + 4) {
        if(text.charAt(i) + text.charAt(i+1) + text.charAt(i+2) + text.charAt(i+3) == text.charAt(i+4) + text.charAt(i+5) + text.charAt(i+6) + text.charAt(i+7)) {
            numberRepetitions++;
        } else {
            repeatingCharacters += (numberRepetitions ? numberRepetitions + 1 : '1') + text.charAt(i) + text.charAt(i+1) + text.charAt(i+2) + text.charAt(i+3);
            numberRepetitions = 0;
        }
    }

    let newRepeatingCharacters = "";

    for (let i = 0; i <= repeatingCharacters.length; i = i+5) {
        const count = Number(repeatingCharacters.charAt(i));

        for (var j = 0; j < count; ++j) {
            newRepeatingCharacters = newRepeatingCharacters + repeatingCharacters.charAt(i + 1) + repeatingCharacters.charAt(i + 2) + repeatingCharacters.charAt(i + 3) + repeatingCharacters.charAt(i + 4);
        }
    }

    return {
        coding: repeatingCharacters,
        decoding: newRepeatingCharacters,
        bitDo: new Blob([text]).size * 8,
        bitPosle: new Blob([repeatingCharacters]).size * 8,
        compressiya: Math.round(((new Blob([text]).size * 8) - (new Blob([repeatingCharacters]).size * 8))/(new Blob([text]).size * 8) * 100),
    }
}