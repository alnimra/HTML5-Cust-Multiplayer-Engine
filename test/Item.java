public class Item {
	
	private int val;
	Item parent1, parent2;
	
	public Item (Item input1, Item input2) {
		parent1 = input1;
		parent2 = input2;
		val = parent1.getVal() * parent2.getVal();
	}
	
	public Item (int inval) {
		val = inval;
		parent1 = parent2 = null;
	}
	
	public int getVal() { return val; }
	
	public String toString() {
		return "(" + val + " " + ((parent1 == null)?"":parent1.getVal()) + " " + ((parent2 == null)?"":parent2.getVal()) + ")\n";
	}
	
	public boolean equals(Item e) {
		return (e.getVal() == val);
	}
	
}