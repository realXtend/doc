def get_calls(foo=None):
    calls = {}
    calls['addEventListener'] = ['constant', 'this', 'string']
    calls['System.currentTimeMillis'] = list()
    calls['update'] = ['tick']
    calls['sendBallUpdate'] = list()
    calls['Thread.sleep'] = ['interval']
    calls['synchronized'] = list()
    calls['updatePaddle'] = ['paddle', 'tick']
    calls['updateBall'] = list()
    calls['paddle.setY'] = ['new_y']
    calls['ball.getx'] = list()
    calls['ball.gety'] = list()
    calls['ball.setx'] = ['x']
    calls['ball.sety'] = ['y']
    calls['bounceBall'] = ['value']
    calls['ball.setSpeed'] = ['speed']
    calls['sendScoreUpdate'] = list()
    calls['resetBall'] = list()
    calls['sendBallUpdate'] = list()
    calls['ball.setDirection'] = ['dir']
    calls['math.random'] = list()
    calls['ctx.getRoom'] = list()
    calls['.setAttribute'] = ['score', 'leftScore', 'SCOPE', 'FLAG']
    calls['evt.getClient'] = list()
    calls['sendMessage'] = ['START_GAME']
    calls['notify'] = list()
    calls['removeEventlistener'] = ['const', 'this', 'onClientChanged']
    calls['evt.getAttribute'] = list()
    calls['getScope'] = list()
    calls['equals'] = ['stuff']
    calls['getQualifiedID'] = list()
    calls['nullSafeGetValue'] = list()
    calls['.split'] = ['param']
    

    return calls
    
if __name__ == '__main__':
    print get_calls()
