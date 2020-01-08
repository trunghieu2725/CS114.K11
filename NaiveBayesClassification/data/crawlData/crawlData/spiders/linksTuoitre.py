import scrapy

class linkSpider(scrapy.Spider):
	name = "links"
	start_urls = ['https://tuoitre.vn']

	def parse(self, response):
		yield { 'url' : response.css('h3 a::attr(href)').getall()}
		
		for next_page in  response.css('ul.menu-ul li.menu-li a::attr(href)'):
			if next_page.get() is not None:
				yield response.follow(next_page.get(), callback=self.parse)
