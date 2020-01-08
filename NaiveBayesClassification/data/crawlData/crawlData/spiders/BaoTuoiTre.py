import scrapy
import json

from ..items import CrawldataItem

def formatLinks():
	with open('D:\\OneDrive - Trường ĐH CNTT - University of Information Technology\\Projects\\NLP\\NaiveBayesClassification\\data\\crawlData\\links.json', 'r') as listLink:
		data = listLink.read()
		urls = json.loads(data)

	links = []
	for i in urls:
		links.extend(i['url'])

	print(len(links))
	domain = 'https://tuoitre.vn';
	reconvert = []
	for url in links:
		t = domain+url
		if (t not in reconvert):
			reconvert.append(t)

	return reconvert


class BaoTuoiTreSpider(scrapy.Spider):
	name = 'baotuoitre'
	# allowed_domains = [
	# 	'https://tuoitre.vn/',
	# 	'https://congnghe.tuoitre.vn',
	# 	'https://dulich.tuoitre.vn',
	# 	'https://thethao.tuoitre.vn',
	# ]

	start_urls = formatLinks()

	def parse(self, response):
		yield {
			'theme': response.css('div.bread-crumbs ul li a::text').get(),
			'title': response.css('h1.article-title::text').get(),
			'sapo': response.css('h2.sapo::text').get(),
			'content': response.css('div#main-detail-body p::text').getall()
		}

		domain = 'https://tuoitre.vn';
		for next_page in  response.css('ul.list-news li a::attr(href)'):
			t = next_page.get()
			if ((t is not None) and (t not in start_urls)):
				yield response.follow(next_page.get(), callback=self.parse)