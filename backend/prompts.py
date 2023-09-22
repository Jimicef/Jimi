MAIN_PROMPT = """You are JIMI, AI ChatBot.
Please provide concise and wise answers to the questions asked by the users.
Please generate query in the asked language.
For exmple, if asked in Korean, please generate query in Korean.
Try to be fun and engaging, but also polite and respectful.
"""

CHAT_PROMPT = """
Guidelines for generating responses:

0. you should always include "\n\n" in responses to make them more readable.
1. Do not providing extra explanations for parts not directly asked by the user.
2. avoiding unnecessary symbols.
"""

PLUGIN_SELECT_PROMPT = """
You are API caller plugin. Based on the user input, you will call an relevant API path with relevent query.
Generate relevent query for the best results for the API path. 
Note that we are using traditional search engine API, so we need to generate good words for the search engine rather then entire sentence or given query.
Please generate query in the asked language.
For exmple, if asked in Korean, please generate query in Korean.
Please do not provide any explnation, just provide the API path with query parameters stricktly in this json format:
{'path': api_path, 'query': query}

If the query is not relevant to the plugin, please provide the best answer you can think of using previous context if any.
"""

PLUGIN_RESULT_PROMPT = """For the given user question, we have called the API and get search results in json format.
Please refer these results and aswer to the user. If there are references, please provide them as well. 
You can use MD format to provide the results.
"""

FUNCTIONS = [
    {
        "name": "answer_with_service_info",
        "description": f"""
        This function is available when the user asks what is in the service information, otherwise it is not available.
        """,
        "parameters": {
            "type": "object",
            "properties": {
                "keyword": {
                    "type": "string",
                    "description": f"""The keyword to use for summarizing service information
                    for example,
                    신청기한,접수센터,서비스이름,선정기준,담당기관,지원대상,지원내용,접수센터,지원형태,제출서류,서비스,보조금,지원금
                    """
                },
            },
            "required": ["keyword"],
        },
    },
    {
        "name": "get_search_info",
        "description": "If it is difficult to answer, select a keyword from the question and make it search.",
        "parameters": {
            "type": "object",
            "properties": {
                "keyword": {
                    "type": "string",
                    "description": "The keyword to use for the information search",
                },
            },
            "required": ["keyword"],            
        },
    }
]

MODEL = "gpt-3.5-turbo-16k"

GET_CHAT_PROMPT = """
Summarize the application deadline, application method, support content, support target, and support method.
refer to the service information below.

Please generate response in the korean language.
please Avoid repeating the same word and provide the response in a conversational manner as if a person were speaking.
"""

region_names = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시", "경기도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도", "강원특별자치도"]
sub_region_names = {"서울특별시": ["전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"], "부산광역시": ["전체", "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"], "대구광역시": ["전체", "군위군", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"], "인천광역시": ["전체", "강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "옹진군", "중구"], "광주광역시": ["전체", "광산구", "남구", "동구", "북구", "서구"], "대전광역시": ["전체", "대덕구", "동구", "서구", "유성구", "중구"], "울산광역시": ["전체", "남구", "동구", "북구", "울주군", "중구"], "세종특별자치시": ["전체", "세종특별자치시"], "경기도": ["전체", "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"], "충청북도": ["전체", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시", "충주시"], "충청남도": ["전체", "계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"], "전라북도": ["전체", "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"], "전라남도": ["전체", "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"], "경상북도": ["전체", "경산시", "경주시", "고령군", "구미시", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"], "경상남도": ["전체", "거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"], "제주특별자치도": ["전체", "서귀포시", "제주시"], "강원특별자치도": ["전체", "강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"]}
chktype1_code = {
        "생활안정": "NB0301","주거·자립": "NB0302", "보육·교육": "NB0303", "고용·창업": "NB0304", "보건·의료": "NB0305", "행정·안전": "NB0306", "임신·출산": "NB0307", "보호·돌봄": "NB0308", "문화·환경": "NB0309", "농림축산어업": "NB0310"
}

VOICE_FUNCTIONS = [
    {
        "name": "get_api_service_list",
        "description": f"""
        This function allows you to search for government subsidies and obtain related information.
        you must generate all parameters.
        """,
        "parameters": {
            "type": "object",
            "properties": {
                "keyword": {
                    "type": "string",
                    "description": f"""This variable is used as a keyword for conducting subsidy searches.
                    Extract the key words from the user's question.
                    For example, if the question is 'Tell me about '장애인 지원금',' the key word is '장애인'.

                    """
                },
                "chktype1": {
                    "type": "string",
                    "description": f"""chktype1 is a variable representing the service category. 
                    match user's desired service category to a key in chktype1_code and set the code value as the variable's value.
                    
                    For example, if a user wants the service category to be "Housing Support," then "NB0302" with the key "주거·자립" in chktype1_code is set as the value of chktype1.
                    
                    CHKTYPE1_CODE:
                        {chktype1_code}
                    """
                },
                "siGunGuArea": {
                    "type": "string",
                    "description": f"""This variable signifies the sub-region of your residence. 
                    Please use only the sub-region names listed below as valid values for this variable.
                    You can only use the name of a subregion that corresponds to the region specified in the 'sidocode' variable as its key.
                    
                    for example, If the user's 'sidocode' value is "서울특별시" (Seoul), then the 'siGunGuArea' value should be selected from the following options:

                    default : '전체'

                    ['전체','강남구','강동구', '강북구', '강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구', '중구', '중랑구']
                    
                    SUB-REGION NAMES:
                        {sub_region_names}
                    """
                },
                "sidocode": {
                    "type": "string",
                    "description": f"""This variable indicates user's place of residence.
                    Only the region names listed below should be used as valid values for this variable.

                    REGION NAMES:
                        {region_names}
            
                    """
                },
                "svccd": {
                    "type": "string",
                    "description": f""""This variable represents user specificity and is only categorized into three types as follows:
                        If the user is an individual, the variable is set to 'indiv'
                        If the user is a small business owner, the variable is set to 'business'
                        If the user is a corporate entity, the variable is set to 'owner'
                        
                    """
                },
                "nextPage": {
                    "type": "boolean",
                    "description": f"""This variable should be set to 'True' when a user requests the next page, otherwise it should be 'False'.
                    
                        It must be 'True' if and only if the user includes 'next' in their request; otherwise, it should be 'False'. 
                        If 'prevPage' is 'True', then it must be 'False'; 'prevPage' and 'nextPage' cannot both be 'True' at the same time.
                    """
                },
                "prevPage": {
                    "type": "boolean",
                    "description": f"""This variable is set to 'True' when a user requests a previous page, otherwise it should be 'False'
                        default : False
                        
                        It should be 'True' if and only if the user includes 'prev' in their request; otherwise, it should be 'False'. 
                        If 'nextPage' is 'True', it must be 'False'; both 'prevPage' and 'nextPage' cannot simultaneously be 'True'.
                    """
                },
            },
            "required": ["keyword","chktype1","siGunGuArea","sidocode","svccd","nextPage","prevPage"],
        },
    },
    {
        "name": "get_api_chat",
        "description": "This function returns a number based on user input.",
        "parameters": {
            "type": "object",
            "properties": {
                "serviceNumber": {
                    "type": "integer",
                    "description": "The number chosen by the user, a natural number between 1 and 6.",
                },
            },
            "required": ["serviceNumber"],            
        },
    },
    {
        "name": "post_api_chat",
        "description": """This function allows users to engage in a question-and-answer session related to the selected subsidy service.
            
            
            """,
            #It can only be called after the 'get_api_service_list' function has been executed.
            #This function can be used to generate answers to questions related to the following keywords.
            #keywords: 신청기한,접수센터,서비스이름,선정기준,담당기관,지원대상,지원내용,접수센터,지원형태,제출서류,서비스,보조금,지원금
        "parameters": {
            "type": "object",
            "properties": {
                "question": {
                    "type": "string",
                    "description": "This variable is the user's questions."
                
                },
            },
            "required": ["question"],            
        },
    }
]

