export namespace main {
	
	export class VidThumb {
	    filename: string;
	    thumb: string;
	
	    static createFrom(source: any = {}) {
	        return new VidThumb(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.filename = source["filename"];
	        this.thumb = source["thumb"];
	    }
	}

}

