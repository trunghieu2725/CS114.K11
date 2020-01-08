# import scrapy
# import json

# def formatLinks():
# 	with open('D:\\OneDrive - Trường ĐH CNTT - University of Information Technology\\Projects\\NLP\\NaiveBayesClassification\\data\\crawlData\\linksVnexpress.json', 'r') as listLink:
# 		data = listLink.read()
# 		urls = json.loads(data)

# 	links = []
# 	for i in urls:
# 		links.extend(i['url'])

# 	print(len(links))
# 	reconvert = []
# 	for url in links:
# 		if (url not in reconvert):
# 			reconvert.append(url)

# 	return reconvert


# class BaoTuoiTreSpider(scrapy.Spider):
# 	name = 'baovnexpress'

# 	start_urls = formatLinks()

# 	def parse(self, response):
# 		yield {
#             'theme' : response.css('li.start h4 a::text').get(),
#             'title' : response.css('h1.title_news_detail::text').get(),
#             'sapo' : response.css('p.description::text').get(),
#             'content' : response.css('p.Normal::text').getall()
#         }

# 		for next_page in  response.css('ul.list_title li h4 a::attr(href)'):
# 			t = next_page.get()
# 			if ((t is not None) and (t not in start_urls)):
# 				yield response.follow(next_page.get(), callback=self.parse)