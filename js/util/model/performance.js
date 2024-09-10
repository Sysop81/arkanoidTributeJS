/**
 * Class Performance
 * This class represents the performance FPS calculator.
 */
export class Performance{
    constructor(){
        this.lastTime =  performance.now();
        this.fps = 0;

        this.lastFrameTime = 0;
        this.frameInterval = 1000;
        
    }

    /**
     * getFPS 
     * Getter for fps property
     * @returns 
     */
    getFPS(){
        return this.fps;
    }    

    /**
     * calculateFPS
     * This method calculates the fps
     * @param {*} currentTime 
     */
    calculateFPS(currentTime){
        if (!this.lastFrameTime) this.lastFrameTime = currentTime;
        const elapsedTime = currentTime - this.lastFrameTime;

        if (elapsedTime >= this.frameInterval) {
            this.fps = Math.round(1000 / (currentTime - this.lastTime));
            this.lastTime = currentTime;
            setTimeout(()=>{this.lastFrameTime = currentTime},100);
        }
    }
}