export class MFile {
	buffer: Buffer;
	originalname: string;

	constructor(file: Express.Multer.File | MFile) {
		this.buffer = file.buffer;
		this.originalname = file.originalname;
	}
}
