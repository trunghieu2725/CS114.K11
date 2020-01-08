# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class CrawldataItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    theme = scrapy.Field()
    title = scrapy.Field()
    sapo = scrapy.Field()
    content = scrapy.Field()
    pass
