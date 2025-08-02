import { makeAutoObservable } from "mobx";

class Logger {
	constructor() {
		makeAutoObservable(this);
	}
}
