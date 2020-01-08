import scrapy

class linkSpider(scrapy.Spider):
	name = "linksdantri"
	start_urls = ['https://dantri.com.vn']

	def parse(self, response):
		yield { 'url' : response.css('h4 a::attr(href)').getall()}
		
		for next_page in  response.css('ul.nav li a::attr(href)'):
			if next_page.get() is not None:
				yield response.follow(next_page.get(), callback=self.parse)
