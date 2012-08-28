package net.user1.union.example.pong;

import java.text.DecimalFormat;
import net.user1.union.api.Client;
import net.user1.union.api.Module;
import net.user1.union.core.attribute.Attribute;
import net.user1.union.core.context.ModuleContext;
import net.user1.union.core.event.ClientEvent;
import net.user1.union.core.event.RoomEvent;
import net.user1.union.core.exception.AttributeException;

/**
 * This is the RoomModule that controls the pong game. The Reactor (Flash) 
 * client requests that the module be attached when it when it invokes 
 * roomManager()'s createRoom() method. 
 * 
 * The server will create a new instance of this module for each room.
 */
public class PongRoomModule implements Module, Runnable {
    // --- the module context
    // --- use this to get access to the server and the room this module
    // --- is attached to
    private ModuleContext m_ctx;
    // --- the thread for the app
    private Thread m_thread;
    // --- players and their objects
    private Client m_leftPlayer;
    private Client m_rightPlayer;
    private PongObject m_leftPaddle;
    private PongObject m_rightPaddle;
    private int m_leftPlayerScore;
    private int m_rightPlayerScore;
    // --- world objects
    private PongObject m_ball;
    // --- flag that a game is being played
    private boolean m_isGameRunning;
    // --- how often the game loop should pause (in milliseconds) between updates
    private static final int GAME_UPDATE_INTERVAL = 20;
    // --- how often the server should update clients with the world state
    // --- (i.e. the position and velocity of the ball)
    private static final long BALL_UPDATE_INTERVAL = 5000L;
    // --- game metrics
    private static final int COURT_HEIGHT = 480;            // pixels
    private static final int COURT_WIDTH = 640;             // pixels
    private static final int BALL_SIZE = 10;                // pixels
    private static final int INITIAL_BALL_SPEED = 150;      // pixels / sec
    private static final int BALL_SPEEDUP = 25;             // pixels / sec
    private static final int PADDLE_HEIGHT = 60;            // pixels 
    private static final int PADDLE_WIDTH = 10;             // pixels
    private static final int PADDLE_SPEED = 300;            // pixels / sec
    private static final int WALL_HEIGHT = 10;              // pixels
    // --- attribute constants
    private static final String ATTR_PADDLE = "paddle";
    private static final String ATTR_SIDE = "side";
    private static final String ATTR_STATUS = "status";
    // --- decimal format for sending rounded values to clients
    private DecimalFormat m_decFmt = new DecimalFormat("0.##########");
    
    /**
     * The init method is called when the instance is created.
     */
    public boolean init(ModuleContext ctx) {
        m_ctx = ctx;
      
        // --- create our world objects
        m_ball = new PongObject(0,0,INITIAL_BALL_SPEED,0);
        
        // --- register to receive events
        m_ctx.getRoom().addEventListener(RoomEvent.ADD_CLIENT, this, 
                "onAddClient");
        m_ctx.getRoom().addEventListener(RoomEvent.REMOVE_CLIENT, this, 
                "onRemoveClient");
      
        // --- create the app thread and start it
        m_thread = new Thread(this);
        m_thread.start();
        
        // --- the module initialized fine
        return true;
    }

    /**
     * Called by the game thread. Contains the main game loop.
     */
    public void run() {
        long lastBallUpdate = 0;
        
        // --- while the room module is running
        while (m_thread != null) {
            // --- init the ticks
            long lastTick = System.currentTimeMillis();
            long thisTick;
            
            // --- while a game is running
            while (m_isGameRunning) {
                thisTick = System.currentTimeMillis();
                
                // --- update the game with the difference in ms since the 
                // --- last tick
                lastBallUpdate += thisTick-lastTick;
                update(thisTick-lastTick);
                lastTick = thisTick;
                
                // --- check if time to send a ball update
                if (lastBallUpdate > BALL_UPDATE_INTERVAL) {
                    sendBallUpdate();
                    lastBallUpdate -= BALL_UPDATE_INTERVAL;
                }
                
                // --- pause game
                try {
                    Thread.sleep(GAME_UPDATE_INTERVAL);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } 
            }
            
            // --- game has stopped
            // --- wait for game to run again when enough clients join
            synchronized (this) {
                try {
                    wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }      
    }

    /**
     * Update the world.
     * 
     * @param tick the time in milliseconds since the last update 
     */
    public void update(long tick) {
        // --- update players      
        updatePaddle(m_leftPaddle, tick);
        updatePaddle(m_rightPaddle, tick);
        
        // --- update the ball
        updateBall(tick);
    }
    
    /**
     * Update the position of a paddle.
     * 
     * @param paddle the paddle to update
     * @param tick the time in milliseconds since the last update 
     */
    private void updatePaddle(PongObject paddle, long tick) {
        paddle.setY(Math.max(Math.min(paddle.getY()-
                Math.sin(paddle.getDirection())*paddle.getSpeed()*tick/1000,
                COURT_HEIGHT-WALL_HEIGHT-PADDLE_HEIGHT), WALL_HEIGHT));
    }
    
    /**
     * Update the ball
     * 
     * @param tick the time in milliseconds since the last update 
     */
    private void updateBall(long tick) {
        // --- determine the new X,Y without regard to game boundaries
        double ballX = m_ball.getX() + 
                Math.cos(m_ball.getDirection())*m_ball.getSpeed()*tick/1000;
        double ballY = m_ball.getY() - 
                Math.sin(m_ball.getDirection())*m_ball.getSpeed()*tick/1000;
        
        // --- set the potential new ball position which may be overridden below
        m_ball.setX(ballX);
        m_ball.setY(ballY);
        
        // --- determine if the ball hit a boundary
        // --- NOTE: this is a rough calculation and does not attempt to 
        // --- interpolate within a tick to determine the exact position
        // --- of the ball and paddle at the potential time of a collision
        if (ballX < PADDLE_WIDTH) {
            // --- left side
            if ((ballY + BALL_SIZE > m_leftPaddle.getY()) && 
                    ballY < (m_leftPaddle.getY() + PADDLE_HEIGHT)) {
                // --- paddle hit the ball so it will appear the same distance 
                // --- on the other side of the collision point and angle will
                // --- flip
                m_ball.setX(2*PADDLE_WIDTH - ballX);
                bounceBall(m_ball.getDirection() > Math.PI ? 3*Math.PI/2 : Math.PI/2);
                m_ball.setSpeed(m_ball.getSpeed() + BALL_SPEEDUP);
            } else {
                // --- increase score
                m_rightPlayerScore++;
                sendScoreUpdate();
                
                // --- reset ball
                resetBall();
                sendBallUpdate();
            }
        } else if (ballX > (COURT_WIDTH-PADDLE_WIDTH-BALL_SIZE)) {
            // --- right side
            if ((ballY + BALL_SIZE > m_rightPaddle.getY()) && 
                    ballY < (m_rightPaddle.getY() + PADDLE_HEIGHT)) {
                // --- paddle hit the ball so it will appear the same distance 
                // --- on the other side of the collision point and angle will
                // --- flip
                m_ball.setX(2*(COURT_WIDTH-PADDLE_WIDTH-BALL_SIZE) - ballX);
                bounceBall(m_ball.getDirection() > 3*Math.PI/2 ? 3*Math.PI/2 : Math.PI/2);
                m_ball.setSpeed(m_ball.getSpeed() + BALL_SPEEDUP);
            } else {
                // --- increase score
                m_leftPlayerScore++;
                sendScoreUpdate();
                
                // --- reset ball
                resetBall();
                sendBallUpdate();
            } 
        }
        
        // --- the ball may also have hit a top or bottom wall 
        if (ballY < WALL_HEIGHT) {
            // --- top wall
            m_ball.setY(2*WALL_HEIGHT-ballY);
            bounceBall(m_ball.getDirection() > Math.PI/2 ? Math.PI : 2*Math.PI);
        } else if (ballY + BALL_SIZE > COURT_HEIGHT - WALL_HEIGHT) {
            // --- bottom wall
            m_ball.setY(2*(COURT_HEIGHT-WALL_HEIGHT-BALL_SIZE)-ballY);
            bounceBall(m_ball.getDirection() > 3*Math.PI/2 ? 2*Math.PI : Math.PI);
        }
    }
    
    /**
     * Bounces the ball off a wall. Essentially flips the angle over a given 
     * axis. 0(360) degrees is to the right increasing counter-clockwise. 
     * Eg. a ball moving left and bouncing off the bottom wall would be 
     * "flipped" over the 180 degree axis.
     * 
     * @param bounceAxis the axis to flip around
     */
    private void bounceBall(double bounceAxis) {
        m_ball.setDirection(((2*bounceAxis-m_ball.getDirection())+(2*Math.PI))%
                (2*Math.PI));
    }
    
    /**
     * Reset the ball.
     */
    private void resetBall() {
        // --- place it in the middle with initial ball speed
        m_ball.setX(COURT_WIDTH/2-BALL_SIZE/2);
        m_ball.setY(COURT_HEIGHT/2-BALL_SIZE/2);
        m_ball.setSpeed(INITIAL_BALL_SPEED);
        // --- make ball reset moving towards a player
        double dir = 0;
        if (Math.random() < .5) {
            // --- towards left player (between 135 and 225 degrees)
            dir = Math.random()*Math.PI/2+3*Math.PI/4;
        } else {
            // --- towards right player (between 315 and 45 degrees)
            dir = (Math.random()*Math.PI/2+7*Math.PI/4) % (2*Math.PI);
        }
        m_ball.setDirection(dir);
    }
    
    /**
     * Send a score update to clients.
     */
    private void sendScoreUpdate() {
        try {
            m_ctx.getRoom().setAttribute("score", m_leftPlayerScore + "," + 
                    m_rightPlayerScore, Attribute.SCOPE_GLOBAL, 
                    Attribute.FLAG_SERVER_ONLY | Attribute.FLAG_SHARED);
        } catch (AttributeException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Send a ball update to clients.
     */
    private void sendBallUpdate() {
        try {
            m_ctx.getRoom().setAttribute("ball", m_decFmt.format(m_ball.getX()) +
                    "," + m_decFmt.format(m_ball.getY()) + "," + m_ball.getSpeed() + 
                    "," + m_decFmt.format(m_ball.getDirection()), Attribute.SCOPE_GLOBAL, 
                    Attribute.FLAG_SERVER_ONLY | Attribute.FLAG_SHARED);
        } catch (AttributeException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Client joined the game.
     * 
     * @param evt the RoomEvent
     */
    public void onAddClient(RoomEvent evt) {
        synchronized (this) {
            // --- listen for client attribute updates
            evt.getClient().addEventListener(ClientEvent.ATTRIBUTE_CHANGED, this, 
                    "onClientAttributeChanged");
            
            // --- assign them a player
            if (m_leftPlayer == null) {
                m_leftPlayer = evt.getClient();
                m_leftPaddle = new PongObject(0,COURT_HEIGHT/2 - PADDLE_HEIGHT/2, 
                        PADDLE_SPEED, 0);
                try {
                    m_leftPlayer.setAttribute(ATTR_SIDE, "left", 
                            m_ctx.getRoom().getQualifiedID(), 
                            Attribute.FLAG_SERVER_ONLY | Attribute.FLAG_SHARED);
                    m_leftPlayer.setAttribute(ATTR_STATUS, "ready", 
                            m_ctx.getRoom().getQualifiedID(), 
                            Attribute.FLAG_SERVER_ONLY | Attribute.FLAG_SHARED);
                } catch (AttributeException e) {
                    e.printStackTrace();
                }
            } else if (m_rightPlayer == null) {
                m_rightPlayer = evt.getClient();
                m_rightPaddle = new PongObject(COURT_WIDTH-PADDLE_WIDTH,
                        COURT_HEIGHT/2 - PADDLE_HEIGHT/2, PADDLE_SPEED, 0);
                try {
                    m_rightPlayer.setAttribute(ATTR_SIDE, "right", 
                            evt.getRoom().getQualifiedID(), 
                            Attribute.FLAG_SERVER_ONLY | Attribute.FLAG_SHARED);
                    m_rightPlayer.setAttribute(ATTR_STATUS, "ready", 
                            m_ctx.getRoom().getQualifiedID(), 
                            Attribute.FLAG_SERVER_ONLY | Attribute.FLAG_SHARED);
                } catch (AttributeException e) {
                    e.printStackTrace();
                }
            } 
            
            // --- is the game ready?
            if (m_leftPlayer != null && m_rightPlayer != null) {
                m_leftPlayerScore = 0;
                m_rightPlayerScore = 0;
                resetBall();
                evt.getRoom().sendMessage("START_GAME");
                sendBallUpdate();
                sendScoreUpdate();
                m_isGameRunning = true;
                
                // --- start the game loop going again
                notify();
            }
        }
    }
  
    /**
     * Client left the game.
     * 
     * @param evt the RoomEvent
     */
    public void onRemoveClient(RoomEvent evt) {
        synchronized (this) {
            // --- stop listening for attribute changes for this client
            evt.getClient().removeEventListener(ClientEvent.ATTRIBUTE_CHANGED, 
                    this, "onClientAttributeChanged");
            
            // --- remove them as a player
            if (evt.getClient().equals(m_leftPlayer)) {
                m_leftPlayer = null;
            } else if (evt.getClient().equals(m_rightPlayer)) {
                m_rightPlayer = null;
            }
            
            // --- game must be stopped
            evt.getRoom().sendMessage("STOP_GAME");
            m_leftPlayerScore = 0;
            m_rightPlayerScore = 0;
            sendScoreUpdate();
            m_isGameRunning = false;
        }
    }
    
    /**
     * A client attribute changed.
     * 
     * @param evt the ClientEvent
     */
    public void onClientAttributeChanged(ClientEvent evt) {
        // --- was the attribute scoped to this room and for the paddle?
        if (evt.getAttribute().getScope().equals(m_ctx.getRoom().getQualifiedID()) 
                && evt.getAttribute().getName().equals(ATTR_PADDLE)) {
            // --- then update the paddle object
            PongObject paddle = null;
            String[] paddleAttrs = evt.getAttribute().nullSafeGetValue().split(",");
            if (evt.getClient().equals(m_leftPlayer)) {
                paddle = m_leftPaddle;
            } else if (evt.getClient().equals(m_rightPlayer)) {
                paddle = m_rightPaddle;
            }
            
            // --- parse the attribute and set the paddle
            if (paddle != null) {
                paddle.setX(Float.parseFloat(paddleAttrs[0]));
                paddle.setY(Float.parseFloat(paddleAttrs[1]));
                paddle.setSpeed(Integer.parseInt(paddleAttrs[2]));
                paddle.setDirection(Float.parseFloat(paddleAttrs[3]));
            }
        }
    }
    
    /**
     * The shutdown method is called when the server removes the room which
     * also removes the room module.
     */
    public void shutdown() {
        // --- deregister for events
        m_ctx.getRoom().addEventListener(RoomEvent.ADD_CLIENT, this, "onAddClient");
        m_ctx.getRoom().addEventListener(RoomEvent.REMOVE_CLIENT, this, "onRemoveClient");
      
        m_thread = null;
    }
    
    /**
     * A Object within the Pong game (ball and paddle).
     */
    public class PongObject {
        private double m_x; // x pixel position
        private double m_y; // y pixel position
        private int m_speed; // pixels per second
        private double m_direction; // direction the ball is traveling in radians
        
        public PongObject(float x, float y, int speed, float direction) {
            m_x = x;
            m_y = y;
            m_speed = speed;
            m_direction = direction;
        }
        
        public void setX(double x) {
            m_x = x;
        }
        
        public double getX() {
            return m_x;
        }

        public void setY(double y) {
            m_y = y;
        }
        
        public double getY() {
            return m_y;
        }

        public double getDirection() {
            return m_direction;
        }

        public void setDirection(double direction) {
            m_direction = direction;
        }

        public void setSpeed(int speed) {
            m_speed = speed;
        }
        
        public int getSpeed() {
            return m_speed;
        }
    }
}