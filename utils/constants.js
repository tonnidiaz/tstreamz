const tapiKey = process.env.TAPI_KEY
const site = 'TunedStreamz'
const siteDesc = 'Watch all your favorite Movies And TV Shows in HD. Live update'
const company = 'TUNEDBASS'
const year = new Date().getFullYear()
const __DEV__ = process.env.NODE_ENV === 'development' ? true : false
const root = __DEV__ ?  'http://localhost:3000' : 'https://tstreamz.vercel.app'
const dbUrl = __DEV__ ?  'http://localhost:5000' : 'https://ts-bend.vercel.app'
const imgUrl = "https://image.tmdb.org/t/p/w500"
const tmdbUrl = "https://api.themoviedb.org/3/"
const mvs = [
    {
        "backdrop_path": "/7q448EVOnuE3gVAx24krzO7SNXM.jpg",
        "first_air_date": "2021-09-03",
        "genre_ids": [
            10764
        ],
        "id": 130392,
        "name": "The D'Amelio Show",
        "origin_country": [
            "US"
        ],
        "original_language": "en",
        "original_name": "The D'Amelio Show",
        "overview": "From relative obscurity and a seemingly normal life, to overnight success and thrust into the Hollywood limelight overnight, the D’Amelios are faced with new challenges and opportunities they could not have imagined.",
        "popularity": 21.868,
        "poster_path": "/z0iCS5Znx7TeRwlYSd4c01Z0lFx.jpg",
        "vote_average": 9.4,
        "vote_count": 2742,
        "image": "https://image.tmdb.org/t/p/w500/z0iCS5Znx7TeRwlYSd4c01Z0lFx.jpg"
    },
    {
        "backdrop_path": null,
        "first_air_date": "2004-05-10",
        "genre_ids": [
            16,
            35
        ],
        "id": 100,
        "name": "I Am Not an Animal",
        "origin_country": [
            "GB"
        ],
        "original_language": "en",
        "original_name": "I Am Not an Animal",
        "overview": "I Am Not An Animal is an animated comedy series about the only six talking animals in the world, whose cosseted existence in a vivisection unit is turned upside down when they are liberated by animal rights activists.",
        "popularity": 13.643,
        "poster_path": "/qG59J1Q7rpBc1dvku4azbzcqo8h.jpg",
        "vote_average": 9.2,
        "vote_count": 709,
        "image": "https://image.tmdb.org/t/p/w500/qG59J1Q7rpBc1dvku4azbzcqo8h.jpg"
    },
    {
        "backdrop_path": "/rkB4LyZHo1NHXFEDHl9vSD9r1lI.jpg",
        "first_air_date": "2021-11-06",
        "genre_ids": [
            16,
            10765,
            10759,
            18
        ],
        "id": 94605,
        "name": "Arcane",
        "origin_country": [
            "US"
        ],
        "original_language": "en",
        "original_name": "Arcane",
        "overview": "Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.",
        "popularity": 110.362,
        "poster_path": "/xQ6GijOFnxTyUzqiwGpVxgfcgqI.jpg",
        "vote_average": 9.1,
        "vote_count": 2231,
        "image": "https://image.tmdb.org/t/p/w500/xQ6GijOFnxTyUzqiwGpVxgfcgqI.jpg"
    },
    {
        "backdrop_path": "/p3cAHHwyTJJoQlCtgYwb31t6rOq.jpg",
        "first_air_date": "2022-04-22",
        "genre_ids": [
            18
        ],
        "id": 124834,
        "name": "Heartstopper",
        "origin_country": [
            "GB"
        ],
        "original_language": "en",
        "original_name": "Heartstopper",
        "overview": "Teens Charlie and Nick discover their unlikely friendship might be something more as they navigate school and young love in this coming-of-age series.",
        "popularity": 168.934,
        "poster_path": "/wJJt1HG62h3WoGnLcRIbO2nNNkg.jpg",
        "vote_average": 9,
        "vote_count": 377,
        "image": "https://image.tmdb.org/t/p/w500/wJJt1HG62h3WoGnLcRIbO2nNNkg.jpg"
    },
    {
        "backdrop_path": "/igxqysAqY84xQISHbZllwV67JPr.jpg",
        "first_air_date": "1978-04-04",
        "genre_ids": [
            16,
            10759,
            10751,
            10762,
            10765
        ],
        "id": 19239,
        "name": "Conan, the Boy in Future",
        "origin_country": [
            "JP"
        ],
        "original_language": "ja",
        "original_name": "未来少年コナン",
        "overview": "After the great disaster of 2008, A war that destroyed the planet, the world is now largely ocean with the continents having sunk. Conan lives on a remote island with his grandpa and nature, never having seen another human being. But one day a mysterious girl, Lana, washes up on his beach. The two become quick friends, but she’s soon kidnapped and taken to Industria, a technological remainder from the world before. Conan leaves his island in pursuit, braving new lands and many hardships with new friends and enemies just beyond the horizon.",
        "popularity": 24.672,
        "poster_path": "/tmlhwdTBA264iQF2Us5vWdKz1fE.jpg",
        "vote_average": 9,
        "vote_count": 105,
        "image": "https://image.tmdb.org/t/p/w500/tmlhwdTBA264iQF2Us5vWdKz1fE.jpg"
    },
    {
        "backdrop_path": "/7gbmM2NWcqZONbp65HUWDf4wr0Q.jpg",
        "first_air_date": "2019-07-12",
        "genre_ids": [
            16,
            18
        ],
        "id": 88040,
        "name": "Given",
        "origin_country": [
            "JP"
        ],
        "original_language": "ja",
        "original_name": "ギヴン",
        "overview": "Tightly clutching his Gibson guitar, Mafuyu Satou steps out of his dark apartment to begin another day of his high school life. While taking a nap in a quiet spot on the gymnasium staircase, he has a chance encounter with fellow student Ritsuka Uenoyama, who berates him for letting his guitar's strings rust and break. Noticing Uenoyama's knowledge of the instrument, Satou pleads for him to fix it and to teach him how to play. Uenoyama eventually agrees and invites him to sit in on a jam session with his two band mates: bassist Haruki Nakayama and drummer Akihiko Kaji.",
        "popularity": 28.463,
        "poster_path": "/lTP5yFKt2wzv8vM4EheNgIejEVu.jpg",
        "vote_average": 9,
        "vote_count": 626,
        "image": "https://image.tmdb.org/t/p/w500/lTP5yFKt2wzv8vM4EheNgIejEVu.jpg"
    },
    {
        "backdrop_path": "/c8dm74uPCMA27iKAR1WnHKTsI9h.jpg",
        "first_air_date": "2015-08-01",
        "genre_ids": [
            10764
        ],
        "id": 77696,
        "name": "Run BTS!",
        "origin_country": [
            "KR"
        ],
        "original_language": "ko",
        "original_name": "달려라 방탄!",
        "overview": "Run BTS! is a South Korean show by the boy band BTS. The show is all about BTS doing activities, challenges and lots more.",
        "popularity": 19.939,
        "poster_path": "/xxv8Ibs8Anni6qrWkAf60rDsPCu.jpg",
        "vote_average": 8.9,
        "vote_count": 277,
        "image": "https://image.tmdb.org/t/p/w500/xxv8Ibs8Anni6qrWkAf60rDsPCu.jpg"
    },
    {
        "backdrop_path": "/qSgBzXdu6QwVVeqOYOlHolkLRxZ.jpg",
        "first_air_date": "2019-01-09",
        "genre_ids": [
            16,
            10759,
            10765,
            18
        ],
        "id": 83095,
        "name": "The Rising of the Shield Hero",
        "origin_country": [
            "JP"
        ],
        "original_language": "ja",
        "original_name": "盾の勇者の成り上がり",
        "overview": "Iwatani Naofumi, a run-of-the-mill otaku, finds a book in the library that summons him to another world. He is tasked with joining the sword, spear, and bow as one of the Four Cardinal Heroes and fighting the Waves of Catastrophe as the Shield Hero. Excited by the prospect of a grand adventure, Naofumi sets off with his party. However, merely a few days later, he is betrayed and loses all his money, dignity, and respect. Unable to trust anyone anymore, he employs a slave named Raphtalia and takes on the Waves and the world. But will he really find a way to overturn this desperate situation?",
        "popularity": 64.58,
        "poster_path": "/ftavpq2PJn5pyo5opJEmj8QleKD.jpg",
        "vote_average": 8.9,
        "vote_count": 861,
        "image": "https://image.tmdb.org/t/p/w500/ftavpq2PJn5pyo5opJEmj8QleKD.jpg"
    },
    {
        "backdrop_path": "/vJacVFr8Or0ddCYCb3ZU5vg3DeK.jpg",
        "first_air_date": "2022-04-14",
        "genre_ids": [
            10764
        ],
        "id": 154521,
        "name": "The Kardashians",
        "origin_country": [
            "US"
        ],
        "original_language": "en",
        "original_name": "The Kardashians",
        "overview": "The family you know and love is here with a brand new series, giving an all-access pass into their lives. Kris, Kourtney, Kim, Khloé, Kendall, and Kylie bring the cameras back to reveal the truth behind the headlines. From the intense pressures of running billion-dollar businesses to the hilarious joys of playtime and school drop-offs, this series brings viewers into the fold with a rivetingly honest story of love & life in the spotlight.",
        "popularity": 217.744,
        "poster_path": "/3cJgB4fOfgHKNoHgtT3h1Qqkvxq.jpg",
        "vote_average": 8.9,
        "vote_count": 1008,
        "image": "https://image.tmdb.org/t/p/w500/3cJgB4fOfgHKNoHgtT3h1Qqkvxq.jpg"
    },
    {
        "backdrop_path": "/hqFaSNICeh0Y3Hp0gtEIzDBmUVo.jpg",
        "first_air_date": "2020-08-19",
        "genre_ids": [
            10764
        ],
        "id": 106600,
        "name": "BTS In the SOOP",
        "origin_country": [
            "KR"
        ],
        "original_language": "ko",
        "original_name": "In the SOOP BTS편",
        "overview": "'In the SOOP BTS ver.' is a reality show, portraying BTS members' everyday life, relaxation, and everything in between, away from the city life. A time of freedom and healing in a place for BTS, and BTS only.",
        "popularity": 25.781,
        "poster_path": "/eBsIEKqLMtktw2jpFPa9WTuGyPN.jpg",
        "vote_average": 8.9,
        "vote_count": 339,
        "image": "https://image.tmdb.org/t/p/w500/eBsIEKqLMtktw2jpFPa9WTuGyPN.jpg"
    },
    {
        "backdrop_path": "/1ejS56lC8db62IKVj1pTQlfAEQy.jpg",
        "first_air_date": "2018-09-13",
        "genre_ids": [
            10759,
            16,
            18,
            10751
        ],
        "id": 123566,
        "name": "Metal Family",
        "origin_country": [
            "RU"
        ],
        "original_language": "ru",
        "original_name": "Metal Family",
        "overview": "Metal Family follows the daily lives of Glam and Victoria, two metal fans that fell in love and had two children together, Dee and Heavy.",
        "popularity": 28.076,
        "poster_path": "/yovTSLBdNjXIVo8CPaPWFE5NcAw.jpg",
        "vote_average": 8.9,
        "vote_count": 323,
        "image": "https://image.tmdb.org/t/p/w500/yovTSLBdNjXIVo8CPaPWFE5NcAw.jpg"
    },
    {
        "backdrop_path": "/ci7jTekDFEx6U48XUCl3vBMdrns.jpg",
        "first_air_date": "2018-07-06",
        "genre_ids": [
            10759,
            18,
            9648,
            16,
            80
        ],
        "id": 80564,
        "name": "Banana Fish",
        "origin_country": [
            "JP"
        ],
        "original_language": "ja",
        "original_name": "バナナフィッシュ",
        "overview": "Nature made Ash Lynx beautiful; nurture made him a cold ruthless killer. A runaway brought up as the adopted heir and sex toy of \"Papa\" Dino Golzine, Ash, now at the rebellious age of seventeen, forsakes the kingdom held out by the devil who raised him. But the hideous secret that drove Ash's older brother mad in Vietnam has suddenly fallen into Papa's insatiably ambitious hands—and it's exactly the wrong time for Eiji Okamura, a pure-hearted young photographer from Japan, to make Ash Lynx's acquaintance...",
        "popularity": 36.973,
        "poster_path": "/1UV5di9UIXwrpCW3xQ4RNli5hEV.jpg",
        "vote_average": 8.9,
        "vote_count": 711,
        "image": "https://image.tmdb.org/t/p/w500/1UV5di9UIXwrpCW3xQ4RNli5hEV.jpg"
    },
    {
        "backdrop_path": "/iLR6tKvMu67oSK0DIgDutkPBaiy.jpg",
        "first_air_date": "2018-07-08",
        "genre_ids": [
            35,
            16
        ],
        "id": 80539,
        "name": "Asobi Asobase - workshop of fun -",
        "origin_country": [
            "JP"
        ],
        "original_language": "ja",
        "original_name": "あそびあそばせ",
        "overview": "During recess, Olivia, a foreign transfer student who doesn't know English, plays a game of \"look-the-other-way\" with Hanako Honda, a loud-mouthed airhead. Their rowdy behavior spurs the ire of Kasumi Nomura, a deadpan loner constantly teased by her older sister for her tendency to lose games. Not willing to compete, Kasumi declines Olivia's offer to join the fun, but eventually gets involved anyway and dispenses her own brand of mischief. Soon, a strange friendship blossoms between the peculiar trio, and they decide to form the \"Pastime Club,\" where they are free to resume their daily hijinks.\n\nWhether it be failing to learn English, trying desperately to become popular, or getting caught by teachers at the wrong time, school life will never be boring when these girls are up to their hilarious antics.",
        "popularity": 16.407,
        "poster_path": "/zWE3bnCILcRpfQCsxBkMsgcEjOE.jpg",
        "vote_average": 8.9,
        "vote_count": 108,
        "image": "https://image.tmdb.org/t/p/w500/zWE3bnCILcRpfQCsxBkMsgcEjOE.jpg"
    },
    {
        "backdrop_path": "/4sSzTvk200BQyYjRJq69mLwE9xG.jpg",
        "first_air_date": "2018-04-25",
        "genre_ids": [
            16,
            35,
            18,
            10759
        ],
        "id": 79141,
        "name": "Scissor Seven",
        "origin_country": [
            "CN"
        ],
        "original_language": "zh",
        "original_name": "刺客伍六七",
        "overview": "Seeking to recover his memory, a scissor-wielding, hairdressing, bungling quasi-assassin stumbles into a struggle for power among feuding factions.",
        "popularity": 75.009,
        "poster_path": "/A39DWUIrf9WDRHCg7QTR8seWUvi.jpg",
        "vote_average": 8.8,
        "vote_count": 455,
        "image": "https://image.tmdb.org/t/p/w500/A39DWUIrf9WDRHCg7QTR8seWUvi.jpg"
    },
    {
        "backdrop_path": "/ohOrfdh80HVY5QBD8kV2FYYSVwF.jpg",
        "first_air_date": "2021-01-10",
        "genre_ids": [
            16,
            10759
        ],
        "id": 110309,
        "name": "SK8 the Infinity",
        "origin_country": [
            "JP"
        ],
        "original_language": "ja",
        "original_name": "SK∞ エスケーエイト",
        "overview": "\"S\" is a dangerous, top secret, no-holds-barred downhill skateboarding race down an abandoned mine. When avid skateboarder Reki takes Langa to the mountain where \"S\" is held, Langa, who's never been on a skateboard in his life, finds himself sucked into the world of \"S\", and…?!",
        "popularity": 46.473,
        "poster_path": "/ksb6QlSCsRLr3MNmxc8ojOOLK6V.jpg",
        "vote_average": 8.8,
        "vote_count": 227,
        "image": "https://image.tmdb.org/t/p/w500/ksb6QlSCsRLr3MNmxc8ojOOLK6V.jpg"
    },
    {
        "backdrop_path": "/uAjMQlbPkVHmUahhCouANlHSDW2.jpg",
        "first_air_date": "2019-01-11",
        "genre_ids": [
            16,
            9648,
            10765,
            10759,
            18
        ],
        "id": 83097,
        "name": "The Promised Neverland",
        "origin_country": [
            "JP"
        ],
        "original_language": "ja",
        "original_name": "約束のネバーランド",
        "overview": "Surrounded by a forest and a gated entrance, the Grace Field House is inhabited by orphans happily living together as one big family, looked after by their \"Mama,\" Isabella. Although they are required to take tests daily, the children are free to spend their time as they see fit, usually playing outside, as long as they do not venture too far from the orphanage — a rule they are expected to follow no matter what. However, all good times must come to an end, as every few months, a child is adopted and sent to live with their new family... never to be heard from again.\n\nHowever, the three oldest siblings have their suspicions about what is actually happening at the orphanage, and they are about to discover the cruel fate that awaits the children living at Grace Field, including the twisted nature of their beloved Mama.",
        "popularity": 48.818,
        "poster_path": "/oBgRCpAbtMpk1v8wfdsIph7lPQE.jpg",
        "vote_average": 8.8,
        "vote_count": 807,
        "image": "https://image.tmdb.org/t/p/w500/oBgRCpAbtMpk1v8wfdsIph7lPQE.jpg"
    },
    {
        "backdrop_path": "/x6jWDL4H9TaBLGEvyej0qKiirBU.jpg",
        "first_air_date": "2014-10-10",
        "genre_ids": [
            16,
            35,
            18
        ],
        "id": 61663,
        "name": "Your Lie in April",
        "origin_country": [
            "JP"
        ],
        "original_language": "ja",
        "original_name": "四月は君の嘘",
        "overview": "Kousei Arima was a genius pianist until his mother's sudden death took away his ability to play. Each day was dull for Kousei. But, then he meets a violinist named Kaori Miyazono who has an eccentric playing style. Can the heartfelt sounds of the girl's violin lead the boy to play the piano again?",
        "popularity": 38.636,
        "poster_path": "/IGbeFv5Ji4W0x530JcSHiQpamY.jpg",
        "vote_average": 8.8,
        "vote_count": 720,
        "image": "https://image.tmdb.org/t/p/w500/IGbeFv5Ji4W0x530JcSHiQpamY.jpg"
    },
    {
        "backdrop_path": "/2f8OLO6UYp78dIQMs0oi7ja15Bl.jpg",
        "first_air_date": "2010-04-02",
        "genre_ids": [
            16,
            35,
            18
        ],
        "id": 65648,
        "name": "Maid Sama!",
        "origin_country": [
            "JP"
        ],
        "original_language": "ja",
        "original_name": "会長はメイド様！",
        "overview": "Misaki Ayuzawa is the first female student council president at a once all-boys school turned co-ed. She rules the school with strict discipline demeanor. But she has a secret—she works at a maid cafe due to her families circumstances. One day the popular A-student and notorious heart breaker Takumi Usui finds out her secret and makes a deal with her to keep it hush from the school in exchange for spending some time with him.",
        "popularity": 28.068,
        "poster_path": "/igkn0M1bgMeATz59LShvVxZNdVd.jpg",
        "vote_average": 8.8,
        "vote_count": 463,
        "image": "https://image.tmdb.org/t/p/w500/igkn0M1bgMeATz59LShvVxZNdVd.jpg"
    },
    {
        "backdrop_path": "/3ILMlmC30QUnYkY3XEBOyJ82Dqu.jpg",
        "first_air_date": "2016-04-03",
        "genre_ids": [
            10759,
            16
        ],
        "id": 65930,
        "name": "My Hero Academia",
        "origin_country": [
            "JP"
        ],
        "original_language": "ja",
        "original_name": "僕のヒーローアカデミア",
        "overview": "In a world where eighty percent of the population has some kind of super-powered Quirk, Izuku was unlucky enough to be born completely normal. But that won't stop him from enrolling in a prestigious hero academy. Now, he'll get his first taste of brutal rivalry from other schools as he braves the cutthroat, no-holds-barred provisional license exam.",
        "popularity": 49.369,
        "poster_path": "/phuYuzqWW9ru8EA3HVjE9W2Rr3M.jpg",
        "vote_average": 8.8,
        "vote_count": 3730,
        "image": "https://image.tmdb.org/t/p/w500/phuYuzqWW9ru8EA3HVjE9W2Rr3M.jpg"
    },
    {
        "backdrop_path": "/eJe7mLivQYur3FhC9xamIfPgXJ8.jpg",
        "first_air_date": "2020-01-10",
        "genre_ids": [
            16,
            10765,
            35,
            10759
        ],
        "id": 92685,
        "name": "The Owl House",
        "origin_country": [
            "US"
        ],
        "original_language": "en",
        "original_name": "The Owl House",
        "overview": "An animated fantasy-comedy series that follows Luz, a self-assured teenage girl who accidentally stumbles upon a portal to a magical world where she befriends a rebellious witch, Eda, and an adorably tiny warrior, King. Despite not having magical abilities, Luz pursues her dream of becoming a witch by serving as Eda's apprentice at the Owl House and ultimately finds a new family in an unlikely setting.",
        "popularity": 89.438,
        "poster_path": "/f3Dd784YEpaWaJUyRCkhiaKxgB0.jpg",
        "vote_average": 8.8,
        "vote_count": 1107,
        "image": "https://image.tmdb.org/t/p/w500/f3Dd784YEpaWaJUyRCkhiaKxgB0.jpg"
    }
]

export {dbUrl,mvs, root, site,tapiKey, company, siteDesc, year,__DEV__, imgUrl, tmdbUrl}
