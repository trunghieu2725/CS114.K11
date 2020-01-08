var fs = require('fs');
var readlineSync = require('readline-sync');
var stopwords = require('vietnamese-stopwords');

function bagOfWords(BoW, content) {
	var arrWord = content.split(' ');
	// Loại bỏ phần tử rỗng
	while (arrWord.findIndex(x => x === '') !== -1) {
		var t = arrWord.findIndex(x => x === '');
		arrWord.splice(t,1);
	}

	while (arrWord.length > 0) {
		var first = arrWord[0];
		var count = arrWord.filter(x => x === first);
		BoW[first] = count.length;

		while (arrWord.findIndex(x => x === first) !== -1) {
			var pos = arrWord.findIndex(x => x === first);
			arrWord.splice(pos, 1);
		}
	}
}

function joinContent(data) {
	var content = '';
	for (var article of data) {
		content += ' '+article.content;
	}
	return content;
}

function splitCategory(data, category1, category2, nameCagor1) {
	for (var article of data) {
		if (article.category === nameCagor1) {
			category1.push(article);
		}
		else {
			category2.push(article);
		}
	}
	Ptheme1 = category1.length/(category1.length+category2.length);
	Ptheme2 = category2.length/(category1.length+category2.length);
}

function calLamda(nwords, BoW, lamda, total) {
	var arrBow = Object.values(BoW);
	var totalWords = arrBow.reduce((a,b) => a + b,0);	// Tổng số từ có trong tập
	var total = alpha*nwords + totalWords;
	var arrWords = Object.keys(BoW);
	for (var word of arrWords) {
		lamda[word] = (BoW[word]+alpha)/total;
	}
	return total;
}

function train(data, BoW1, BoW2, lamdaCagor1, lamdaCagor2, nameCagor1) {
	var category1 = [];
	var category2 = [];
	var nameCagor1 = nameCagor1;

	splitCategory(data, category1, category2, nameCagor1);
	bagOfWords(BoW1, joinContent(category1));
	bagOfWords(BoW2, joinContent(category2));
	// Tổng số từ xuất hiện trong data
	var allWords = [];
	bagOfWords(allWords, joinContent(data));
	var nwords = Object.keys(allWords).length;

	total1 = calLamda(nwords, BoW1, lamdaCagor1);
	total2 = calLamda(nwords, BoW2, lamdaCagor2);
}

function printResult(Pcagor1, Pcagor2, nameCagor, n1, n2, label, content) {
	var P1 = (Pcagor1/(Pcagor1+Pcagor2));
	var P2 = 1-P1;

	if (content !== undefined) {
		console.log('_________________________________________________________________');
		console.log(content);
		console.log('_________________________________________________________________');
	}
	if (label !== undefined) {
		console.log('Label:',label);
	}

	console.log('Result:');
	console.log('[',n1,':',P1.toFixed(10),', ',n2,':',P2.toFixed(10),']');
	console.log('Conclusion: ',nameCagor,'\n');
}

function preContent(content) {
	// Removed non-words, stopwords
	var regex = /[“ ”!/@–‘’,.…?<>:;'"{}()+%0-9\r\n\t -]+/g;
	var t = content.replace(regex,' ').toLowerCase();
	for (var word of stopwords) {
		var temp = ' '+word+' ';
		while (t.search(temp) !== -1) {
			t = t.replace(temp, ' ');
		}
	}
	return t;
}

function testAnArticle(lamdaCagor1, lamdaCagor2, nameCagor1, nameCagor2, label) {
	var loadContent = fs.readFileSync('./test.txt', {encoding: 'utf-8'});
	var content = preContent(loadContent);
	var result = NaiveBayes({}, content, lamdaCagor1, lamdaCagor2, nameCagor1, nameCagor2, label);
	printResult(result.p1, result.p2, result.conclusion, nameCagor1, nameCagor2, label, result.content);
}

function NaiveBayes(BoW, content, lamdaCagor1, lamdaCagor2, nameCagor1, nameCagor2, label) {
	bagOfWords(BoW, content);
	var words = Object.keys(BoW);
	var t = Math.pow(10,300);
	var Pcagor1 = Ptheme1;
	var Pcagor2 = Ptheme2;
	var tempPcagor1 = 1;
	var tempPcagor2 = 1;

	for (var word of words) {
		tempPcagor1 = Pcagor1;
		tempPcagor2 = Pcagor2;
		var t1;
		var t2;

		if (lamdaCagor1[word] !== undefined) {
			t1 = Math.pow(lamdaCagor1[word], BoW[word]);
			tempPcagor1 *= t1;
		}
		else {
			t1 = Math.pow(alpha/total1, BoW[word]);
			tempPcagor1 *= t1;
		}

		if (lamdaCagor2[word] !== undefined) {
			t2 = Math.pow(lamdaCagor2[word], BoW[word]);
			tempPcagor2 *= t2;
		}
		else {
			t2 = Math.pow(alpha/total2, BoW[word]);
			tempPcagor2 *= t2;
		}

		if (tempPcagor1 === 0 || tempPcagor2 ===0) {
			Pcagor1 = (Pcagor1*t)*t1;
			Pcagor2 = (Pcagor2*t)*t2;
			//break;
		}
		else {
			Pcagor1 = tempPcagor1;
			Pcagor2 = tempPcagor2;			
		}

	}
	
	if (Pcagor1 > Pcagor2) {
		//printResult(Pcagor1, Pcagor2, nameCagor1, nameCagor1, nameCagor2, label);
		return {conclusion: nameCagor1, p1: Pcagor1, p2: Pcagor2, content: content};
	}
	else {
		//printResult(Pcagor1, Pcagor2, nameCagor2, nameCagor1, nameCagor2, label);
		return {conclusion: nameCagor2, p1: Pcagor1, p2: Pcagor2, content: content};
	}
}

function testData(data, lamdaCagor1, lamdaCagor2, nameCagor1, nameCagor2) {
	var count = 0;
	for (var article of data) {
		var BoWTest = {};
		var resultTest = NaiveBayes(BoWTest, article.content, lamdaCagor1, lamdaCagor2, nameCagor1, nameCagor2, article.category);
		if (resultTest.conclusion === article.category) {
			count++;
		}
	}
	var accuracy = (count/data.length)*100;
	console.log('Accuracy:',accuracy+'%');
}

function main() {
	console.time('Execution time');
	var pathTrain = './data/data-train.json';
	var pathTest = './data/data-test.json';
	var dataTrain = JSON.parse(fs.readFileSync(pathTrain, {encoding: 'utf-8'}));
	var dataTest = JSON.parse(fs.readFileSync(pathTest, {encoding: 'utf-8'}));

	var BoW1 = {};
	var BoW2 = {};
	var lamdaCagor1 = {};
	var lamdaCagor2 = {};
	var nameCagor1 = dataTrain[0].category;
	var nameCagor2 = dataTrain[dataTrain.length-1].category;
	alpha = 1;
	total1 = 0;
	total2 = 0;
	Ptheme1 = 1;
	Ptheme2 = 1;

	console.log('Trainning size:',dataTrain.length);
	console.log('Testing size:', dataTest.length)
	train(dataTrain, BoW1, BoW2, lamdaCagor1, lamdaCagor2, nameCagor1);
	testData(dataTest, lamdaCagor1, lamdaCagor2, nameCagor1, nameCagor2);
	console.timeEnd('Execution time');
	do {
		var check;
		do {
			check = readlineSync.question('___________\nNhập 1 - test văn bản nhập vào.\nNhập 0 - thoát\n>');
		} while (check !== '0' && check !== '1');
		if (check === '1') {
			testAnArticle(lamdaCagor1, lamdaCagor2, nameCagor1, nameCagor2);
		}
	} while (check === '1');
}

main();