package threads3_sync;

import java.util.List;

public class Worker1 extends Thread {

	private List<String> items;
		
	public Worker1(List<String> items) {
		super();
		this.items = items;
	}

	@Override
	public /*synchronized*/ void run() {
		for (int i = 0; i < 100; i++) {
			synchronized (items) {				
				items.add("Item" + (i+1));
			}
		}
	}
	
}
