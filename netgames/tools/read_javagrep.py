import klass
from klass import Klass, Method

def get_classes(infilter=None):
    klasses = dict()
    k = Klass('PongRoomModule')
    k.supers = ['Module', 'Runnable']
    k.methods['run'] = Method('run')
    k.methods['update']  =Method('update', ['tick'])
    k.methods['onAddClient'] = Method('onAddClient', ['evt'])
    k.methods['onRemoveClient'] = Method('onRemoveClient', ['evt'])
    k.methods['onClientAttributeChanged'] = Method('onClientAttributeChanged', ['evt'])
    k.methods['shutdown'] = Method('shutdown')
    k.methods['updatePaddle'] = Method('updatePaddle', ['paddle', 'tick'])
    k.methods['updateBall'] = Method('updateBall', ['tick'])
    k.methods['bounceBall'] = Method('bounceBall', ['tick'])
    k.methods['resetBall'] = Method('resetBall')
    k.methods['sendScodeUpdate'] = Method('sendScoreUpdate')

    k.fields = ['m_ctx', 'm_thread', 'm_leftPlayer', 'm_rightPlayer', 'm_leftPaddle', 'm_rightPaddle', 'm_leftPlayerScore', 'm_rightPlayerScore', 'm_ball', 'm_isGameRunning', 'GAME_UPDATE_INTERVAL', 'BALL_UPDATE_INTERVAL', 'COURT_HEIGHT', 'COURT_WIDTH', 'BALL_SIZE', 'INITIAL_BALL_SPEED', 'BALL_SPEEDUP', 'PADDLE_HEIGHT', 'PADDLE_WIDTH', 'PADDLE_SPEED', 'WALL_HEIGHT', 'ATTR_PADDLE', 'ATTR_SIDE', 'ATTR_STATUS', 'm_decFmt']

    k.relations = list(set(['ModuleContext', 'Client', 'PongObject']))

    klasses['PongRoomModule'] = k

    l = Klass('PongObject')
    l.methods['setX'] = Method('setX', ['x'])
    l.methods['getX'] = Method('getX')
    l.methods['setY'] = Method('setY', ['y'])
    l.methods['getY'] = Method('getY')
    l.methods['getDirection'] = Method('getDirection')
    l.methods['setDirection'] = Method('setDirection', ['direction'])
    l.methods['setSpeed'] = Method('setSpeed', ['speed'])
    l.methods['getSpeed'] = Method('getSpeed')

    l.fields = ['m_x', 'm_y', 'm_speed', 'm_direction']

    klasses['PongObject'] = l

    return klasses

if __name__ == '__main__':
    klasses = get_classes()
    klass.printout(klasses)

