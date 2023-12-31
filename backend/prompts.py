MAIN_PROMPT = """You are JIMI, AI ChatBot.
Please provide concise and wise answers to the questions asked by the users.
Please generate query in the asked language.
For exmple, if asked in Korean, please generate query in Korean.
Try to be fun and engaging, but also polite and respectful.
"""

CHAT_PROMPT = """
Guidelines for generating responses:
All responses should be summarized concisely within three sentences.
0. you should always include "\n\n" in responses to make them more readable.
1. Do not providing extra explanations for parts not directly asked by the user.
2. avoiding unnecessary symbols.
3. you NEVER include [link](url) in the response.
"""

# VOICE_FUNCTION_CALL_PROMPT = """
# 이 함수들은 보조금 관련 정보를 가지고 채팅을 하는 서비스에 사용되는 함수들이야.
# 함수들에 대해 설명해줄게.
# - "get_api_service_list": 이 함수는 사용자가 보조금 리스트에 대해서 얻고 싶을 때 사용하는 함수야, 사용자가 사는 지역과 보조금 키워드를 입력받아서 보조금 리스트를 얻을 수 있어, 
# 이때 사용자는 원하는 보조금 리스트가 없으면 "다음" 혹은 "이전"이라고 말해서 "다음페이지" 혹은 "이전페이지"에 대헤 재검색을 할 수 있어

# - "get_number": 이 함수는 사용자가 "get_api_service_list" 함수를 호출해서 얻은 6개의 보조금 리스트 중에서 선택한 번호를 추출하는 함수야, 사용자가 3번 보조금에 대해서 알려달라고 하면 3을 추출할 수 있어.

# - "post_api_chat": 이 함수는 사용자가 "get_api_service_list","get_number" 함수들을 통해 6개의 보조금 중에서 선택한 하나의 보조금에 대해서 질의응답하는 함수야. 사용자가 특정 보조금 관련 질문을 하면 이 함술를 통해서 답변을 얻을 수 있어

# 일반적인 함수 호출 시나리오는 다음과 같아

# 먼저, "get_api_service_list"를 호출해서 6개의 보조금 리스트를 받아온다.
# 그 다음, 사용자가 6개의 보조금 중에서 몇 번인지 번호를 말해주면 "get_number"를 호출해서 그 번호를 정수로 추출한다.
# 마지막으로, "post_api_chat"를 호출해서 사용자가 선택한 하나의 보조금 정보에 대해 질의응답을 할 수 있어.

# 추가적으로 이런 시나리오도 가능하지.
# 먼저, "get_api_service_list"를 호출해서 6개의 보조금 리스트를 받아온다. 하지만 사용자는 원하는 보조금이 6개 중에 없어서 "다음 페이지"라고 입력할 수 있어
# 그러면 다시 "get_api_service_list"를 호출해서 다음 페이지에 있는 6개의 보조금 리스트를 받아온다.
# 그 다음, 사용자가 6개의 보조금 중에서 몇 번인지 번호를 말해주면 "get_number"를 호출해서 그 번호를 정수로 추출한다.
# 마지막으로, "post_api_chat"를 호출해서 사용자가 선택한 하나의 보조금 정보에 대해 질의응답을 할 수 있어.

# """
VOICE_FUNCTION_CALL_PROMPT = """
These functions are used in a chat service that interacts with subsidy-related information. Let me explain the functions:

- "get_api_service_list": This function is used when a user wants to obtain a list of subsidies. It takes the user's location and subsidy keywords as input and returns a list of subsidies. In this case, if the user doesn't find the desired subsidy list, they can say "next" or "previous" to perform a new search for the next or previous page.

- "get_number": This function extracts the chosen number from the 6 subsidy options obtained when the user calls the "get_api_service_list" function. For example, if the user asks for information about subsidy number 3, this function can extract the number 3.

- "post_api_chat": This function allows the user to query and receive answers about one of the subsidies they selected from the 6 options using the "get_api_service_list" and "get_number" functions. When the user asks specific questions related to a particular subsidy, this function provides answers.

A typical function call scenario goes like this:

First, call "get_api_service_list" to fetch the list of 6 subsidies.
Next, when the user specifies the number of the subsidy they are interested in, call "get_number" to extract that number as an integer.
Finally, call "post_api_chat" to allow the user to engage in a Q&A session about the selected subsidy.

Additionally, another scenario is possible:

Start by calling "get_api_service_list" to fetch the initial list of 6 subsidies. However, if the user doesn't find the desired subsidy among these 6, they can input "next page." In response, call "get_api_service_list" again to retrieve the next page with another 6 subsidies.
Then, when the user specifies the number of the desired subsidy, call "get_number" to extract that number as an integer.
Finally, call "post_api_chat" to enable the user to ask questions and receive answers about the selected subsidy.
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
        "This function is called only for questions related to the content found in ***subsidy service information***; otherwise, it is never called.""",
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
        "description": "Through this function, users can obtain Google search results. In cases where the 'answer_with_service_info' function cannot be called, this function can be used to answer the user's queries.",
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
# MODEL = "gpt-3.5-turbo"
AUDIO_MODEL = "whisper-1"

GET_CHAT_PROMPT = """
Summarize the application deadline, application method, support content, support target, and support method.
refer to the service information below.
Please summarize it within 3 sentences.
Please generate response in the korean language.
please Avoid repeating the same word and provide the response in a conversational manner as if a person were speaking.

for example, 
이 지원 서비스는 "장애인 돌봄택시 지원"입니다.
지원대상은 관내 저소득(기초수급자 또는 차상위계층) 장애인이며, 개인별  이용권 제공할 에정입니다.
신청방번은 상시신청입니다.
"""



region_names = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시", "경기도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도", "강원특별자치도"]
sub_region_names = {"서울특별시": ["전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"], "부산광역시": ["전체", "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"], "대구광역시": ["전체", "군위군", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"], "인천광역시": ["전체", "강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "옹진군", "중구"], "광주광역시": ["전체", "광산구", "남구", "동구", "북구", "서구"], "대전광역시": ["전체", "대덕구", "동구", "서구", "유성구", "중구"], "울산광역시": ["전체", "남구", "동구", "북구", "울주군", "중구"], "세종특별자치시": ["전체", "세종특별자치시"], "경기도": ["전체", "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"], "충청북도": ["전체", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시", "충주시"], "충청남도": ["전체", "계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"], "전라북도": ["전체", "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"], "전라남도": ["전체", "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"], "경상북도": ["전체", "경산시", "경주시", "고령군", "구미시", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"], "경상남도": ["전체", "거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"], "제주특별자치도": ["전체", "서귀포시", "제주시"], "강원특별자치도": ["전체", "강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"]}
chktype1_code = [
        "생활안정","주거·자립", "보육·교육", "고용·창업", "보건·의료", "행정·안전", "임신·출산", "보호·돌봄", "문화·환경", "농림축산어업"
]
# chktype1_code = {
#         "생활안정": "NB0301","주거·자립": "NB0302", "보육·교육": "NB0303", "고용·창업": "NB0304", "보건·의료": "NB0305", "행정·안전": "NB0306", "임신·출산": "NB0307", "보호·돌봄": "NB0308", "문화·환경": "NB0309", "농림축산어업": "NB0310"
# }

VOICE_FUNCTIONS = [
    {
        "name": "get_api_service_list",
    
        "description": f"""
        This function is used when a user wants to obtain a list of subsidies. It takes the user's location and subsidy keywords as input and returns a list of subsidies. In this case, if the user doesn't find the desired subsidy list, they can say "next" or "previous" to perform a new search for the next or previous page.
        you MUST generate all parameters below.
        """,
        "parameters": {
            "type": "object",
            "properties": {
                "keyword": {
                    "type": "string",
                    "description": f"""This variable is used as a keyword for conducting subsidy searches.
                    you must Extract the key words from the user's question.
                    For example, if the question is 'Tell me about '장애인 지원금',' the key word is '장애인'.

                    
                    """
                },

                "chktype1": {
                    "type": "string",
                    "description": f"""chktype1 is a variable representing the service category. 
                    You must extract the service category from the user's query.
                    
                    
                    service category:
                        {chktype1_code}
                    """
                },
                
                "siGunGuArea": {
                    "type": "string",
                    "description": f"""This variable signifies the sub-region of your residence. 
                    Please use only the sub-region names listed below as valid values for this variable.
                    You can only use the name of a subregion that corresponds to the region specified in the 'sidocode' variable as its key.
                    
                    for example, If the user's 'sidocode' value is "서울특별시" (Seoul), then the 'siGunGuArea' value should be selected from the following options:

                    

                    ['강남구','강동구', '강북구', '강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구', '중구', '중랑구']
                    
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
                        If the user is an individual, the variable is set to '개인'
                        If the user is a small business owner, the variable is set to '소상공인'
                        If the user is a corporate entity, the variable is set to '법인/시설/단체'
                        
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
            # "required": ["keyword","chktype1","siGunGuArea","sidocode","svccd","nextPage","prevPage"],
            "required": ["keyword","siGunGuArea","sidocode","svccd","nextPage","prevPage"],
        },
    },
    {
        "name": "get_number",
        "description": f"""
        This function extracts the chosen number from the 6 subsidy options obtained when the user calls the "get_api_service_list" function. For example, if the user asks for information about subsidy number 3, this function can extract the number 3.
        you MUST generate all parameters below.
        """,
        "parameters": {
            "type": "object",
            "properties": {
                "serviceNumber": {
                    "type": "integer",
                    "description": f"""The number chosen by the user, a natural number between 1 and 6.
                        """,
                        #When a user mentions a number outside the range of 1 to 6, you must be requested to provide a number between 1 and 6.
                },
            },
            "required": ["serviceNumber"],            
        },
    },
    {
        "name": "post_api_chat",
        "description": """
        This function allows the user to query and receive answers about one of the subsidies they selected from the 6 options using the "get_api_service_list" and "get_number" functions. When the user asks specific questions related to a particular subsidy, this function provides answers.
        you MUST generate all parameters below.
            """,
        "parameters": {
            "type": "object",
            "properties": {
                "question": {
                    "type": "string",
                    "description": "This variable is the user's questions about subsidy service"
                
                },
            },
            "required": ["question"],            
        },
    }
]

