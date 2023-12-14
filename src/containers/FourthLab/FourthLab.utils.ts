export enum ETypeString {
    alphabetic = "alphabetic",
    rgb = "rgb",
}

const isValidateTextArrayElement = (text: string) => {
    return !text.match(/\(\d+,\d+,\d+\)/) ? false : true;
}


export const getUniqueSymbols = (text: string, stringType: ETypeString): Array<string> => {
    const dictionary: Array<string> = [];

    let newString: any;

    if(stringType === ETypeString.alphabetic) {
        newString = text;
    } else {
        const colorInRGB = /\(\d+,\d+,\d+\)/g;

        newString = text.match(colorInRGB);
    }

    for(let i = 0; i < newString.length; i++) {
        if(!dictionary.includes(newString[i])) {
            dictionary.push(newString[i]);
        }
    }
    console.log("dictionary", dictionary);
    
    return dictionary;
}

export const getEncodedText = (text: string): {encodedText: string; dictionary: Array<string>} => {
    // console.log("dictionary");
    
    const encodedArray = [];
    const dictionary = getUniqueSymbols(text, ETypeString.alphabetic);

    let encodedText = "";
    let newText = "";

    for (let i = 0; i < text.length; i++) {
        newText += text[i];
		if (!dictionary.includes(newText)) {
			dictionary.push(newText);
			newText = text[i];
		}

        if (!dictionary.includes(newText + text[i + 1])) {
			encodedArray.push(dictionary.indexOf(newText));
		}
    }

    encodedArray.forEach(element => {
		encodedText += element + " ";
	});

    encodedText = encodedText.slice(-encodedText.length, -1);
    console.log("dictionary", dictionary.join(";"));
    
    return {
        encodedText,
        dictionary
    };
}

export const getEncodeRgb = (text: string): {encodedText: string; dictionary: Array<string>} => {
    console.log("getEncodeRgb");

    const dictionary = getUniqueSymbols(text, ETypeString.rgb);
    console.log("dictionary", dictionary);
    
    const textArray = text.split(" ");
    const encodedArray = [];

    let encodedText = "";
    let newText = "";

    for (let i = 0; i < textArray.length; i++) {
        if(textArray[i] === "") {
            continue;
        }

        if(!isValidateTextArrayElement(textArray[i])) {
            return {
                encodedText: "",
                dictionary: [],
            };
        }

        newText += " " + textArray[i];

		if (!dictionary.includes(newText)) {
			dictionary.push(newText);
			newText = textArray[i];
		}

        if (!dictionary.includes(newText + " " + textArray[i + 1])) {
			encodedArray.push(dictionary.indexOf(newText));
		}
    }

    encodedArray.forEach(element => {
		encodedText += element + " ";
	});

	encodedText = encodedText.slice(-encodedText.length, -1);

    return {
        encodedText,
        dictionary
    };
}

export const getDecodeText = (encodedText: string, stringType: string, dictionary: Array<string>) => {
    const encodedArray = encodedText.split(" ");
    const separator = stringType === ETypeString.rgb ? " " : "";

    let decodedText = "";

    encodedArray.forEach(index => {
		decodedText += dictionary[+index] + separator;
	});

    return decodedText;
}
