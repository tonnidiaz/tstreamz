from flask import request, Blueprint

router = Blueprint('analytics', __name__)

@router.get('/analytics/')
def anals():
    return "ok"
