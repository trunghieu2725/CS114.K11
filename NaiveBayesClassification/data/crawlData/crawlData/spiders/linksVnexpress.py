import scrapy

class linkSpider(scrapy.Spider):
	name = "linksvnexpress"
	start_urls = ['https://vnexpress.net']

	def parse(self, response):
		yield { 'url' : response.css('h4.title_news a::attr(href)').getall()}
		
		for next_page in  response.css('nav.p_menu a::attr(href)'):
			if next_page.get() is not None:
				yield response.follow(next_page.get(), callback=self.parse)
