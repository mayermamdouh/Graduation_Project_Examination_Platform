from django.http import HttpResponse, JsonResponse
import json

def index(request):
    data = {
        'name': 'mahmoud',
    }

    jason_data = json.dumps(data)

    return JsonResponse(jason_data, safe=False)