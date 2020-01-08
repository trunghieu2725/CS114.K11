var stopwords = require('vietnamese-stopwords');
var fs = require('fs');

function compareCategory(a, b) {
	var nameA = a.category.toUpperCase();
	var nameB = b.category.toUpperCase();
	if (nameA < nameB) {
		return -1;
	}
	if (nameA > nameB) {
		return 1;
	}
	return 0;
}

function reformatData(path, data, n) {
	var loadData = JSON.parse(fs.readFileSync(path, {encoding: 'utf-8'}));
	var transfer = [
	{theme: 'SỨC KHỎE',category: 'Health', count: 0},
	{theme: 'THỂ THAO',category: 'Sport', count: 0},
	];

	for (var item of loadData) {
		if (item.theme !== null) {
			var theme = item.theme.toUpperCase();
			var text = item.title + '\n' + item.sapo + '\n' + item.content.join(' ');
			for (var i of transfer) {
				if (theme === i.theme && i.count < n) {
					data.push({category: i.category, content: text});
					i.count++;
				}
			}
		}
	}
	data.sort(compareCategory);
	console.log(transfer);
}

function prepData(tempData, data) {
	// Removed non-words, stopwords
	var regex = /[“ ”!/@–‘’,.…?<>:;'"{}()+%0-9\r\n\t -]+/g;
	for (var item of tempData) {
		var t = item.content.replace(regex,' ').toLowerCase();
		for (var word of stopwords) {
			var temp = ' '+word+' ';
			while (t.search(temp) !== -1) {
				t = t.replace(temp, ' ');
			}
		}
		data.push({category: item.category, content: t});
	}
}

function splitData(dataTrain, dataTest) {
	var tempDataTrain = [];
	var tempDataTest = [];
	var nTrain = 40;
	var nTest = 10;

	reformatData('./data/data2.json', tempDataTrain, nTrain);
	reformatData('./data/data1.json', tempDataTest, nTest);

	prepData(tempDataTrain, dataTrain);
	prepData(tempDataTest, dataTest);

	dataTest.sort(compareCategory);
	dataTrain.sort(compareCategory);
	
	fs.writeFileSync('./data/data-train.json', JSON.stringify(dataTrain), {encoding: 'utf-8'});
	fs.writeFileSync('./data/data-test.json', JSON.stringify(dataTest), {encoding: 'utf-8'});
}


function main() {
	var dataTest = [];
	var dataTrain = [];

	splitData(dataTrain, dataTest);
}
main();