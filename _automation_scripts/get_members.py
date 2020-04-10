import schoolopy
import yaml
import json

# Load schoology api keys from file
with open('keys.yml') as file:
    keys = yaml.load(file, Loader=yaml.FullLoader)

sc = schoolopy.Schoology(schoolopy.Auth(keys['public'], keys['secret']))

def schoology_req(endpoint, data=None):
    if data is not None:
        res = sc.schoology_auth.oauth.post(endpoint, headers=sc.schoology_auth._request_header(), auth=sc.schoology_auth.oauth.auth, json=data)
    else:
        res = sc.schoology_auth.oauth.get(endpoint, headers=sc.schoology_auth._request_header(), auth=sc.schoology_auth.oauth.auth)
    return res

def get_paged_data(
    request_function, 
    endpoint: str, 
    data_key: str,
    next_key: str = 'links',
    max_pages: int = -1, 
    *request_args, 
    **request_kwargs
):
    """
    Schoology requests which deal with large amounts of data are paged.
    This function automatically sends the several paged requests and combines the data
    """
    data = []
    page = 0
    next_url = ''
    while next_url is not None and (page < max_pages or max_pages == -1):
        json = request_function(next_url if next_url else endpoint, *request_args, **request_kwargs).json()
        try:
            next_url = json[next_key]['next']
        except KeyError:
            next_url = None
        data += json[data_key]
        page += 1

    return data

with open('_data/members.json') as file:
    blocked_names = [member['name'] for member in json.load(file)['members']]

members = get_paged_data(schoology_req, 'https://api.schoology.com/v1/groups/2428165656/enrollments', 'enrollment')
for member in members:
    if member['name_display'] in blocked_names or member['admin'] == 1:
        continue
    print(f"""{{
			    "imagepath": "/assets/images/pfp/default_pfp.png",
			    "label": "Member",
			    "name": "{member['name_display']}",
			    "desc": "Description"
            }}""" + ('' if member == members[-1] else ','))

# to run command
# py -3 get_members.py