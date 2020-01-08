import scrapy
import json

from ..items import CrawldataItem

def formatLinks():
	with open('D:\\OneDrive - Trường ĐH CNTT - University of Information Technology\\Projects\\NLP\\NaiveBayesClassification\\data\\crawlData\\linksnld.json', 'r') as listLink:
		data = listLink.read()
		urls = json.loads(data)

	links = []
	for i in urls:
		links.extend(i['url'])

	print(len(links))
	domain = 'https://nld.com.vn'
	reconvert = []
	for url in links:
		t = domain+url
		if (t not in reconvert):
			reconvert.append(t)

	return reconvert


class BaoTuoiTreSpider(scrapy.Spider):
	name = 'baonld'

	start_urls = formatLinks()

	def parse(self, response):
		yield {
			'theme': response.css('li.cat a span::text').get(),
			'title': response.css('h1::text').get(),
			'sapo': response.css('h2.sapo::text').get(),
			'content': response.css('div.contentdetail p::text').getall()
		}

		domain = 'https://nld.com.vn'
		for next_page in  response.css('ul li a::attr(href)'):
			t = next_page.get()
			if ((t is not None) and ((domain + t) not in start_urls)):
				yield response.follow(next_page.get(), callback=self.parse)