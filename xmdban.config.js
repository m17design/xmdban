exports.config = {
douban:
{
apiKey:"apikey=0123456789ABCDEF0123456789ABCDEF",
apiUrl:"http://api.douban.com/v2/movie/",
searchIntheaters:"in_theaters",
search:"search",
userAgent:"Windows / Firefox 56 [Desktop]: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0",
customHeaders:{"Referer": "https://movie.douban.com/","Accept-Language":"zh-CN,cn;q=0.5","Accept-Charset":"utf-8;q=0.7"}
},
imdb:
{
userAgent:"Windows / Firefox 56 [Desktop]: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0",
customHeaders:{"Referer": "https://m.imdb.com/","Accept-Language":"zh-CN,cn;q=0.5","Accept-Charset":"utf-8;q=0.7" }
},
tmdb:
{
apiUrl:"https://api.themoviedb.org/3/",	
apiKey:"api_key=0123456789ABCDEF0123456789ABCDEF",
externalIds:"/external_ids",
userAgent:"Windows / Firefox 56 [Desktop]: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0",
customHeaders:{"Referer":"https://www.themoviedb.org/","Accept-Language":"zh-CN,cn;q=0.5","Accept-Charset":"utf-8;q=0.7" }
},
mysql:
{
host:"192.168.0.1",
username:"abcd",
password:"123456",
database:"MyMovieABCD",
table:"uniqueid_info"
}
}
