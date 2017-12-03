package ressources;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@javax.persistence.Entity
@Table(name = "entities")
public class Entities {
	
	public Entities(String urls, String hashtag, String user_mentions, String symbols) {
		super();
		this.urls = urls;
		this.hashtag = hashtag;
		this.user_mentions = user_mentions;
		this.symbols = symbols;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private int id;
	
	@Column(name = "urls")
	private String urls;
	
	@Column(name = "hashtag")
	private String hashtag;
	
	@Column(name = "user_mentions")
	private String user_mentions;
	
	@Column(name = "symbols")
	private String symbols;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUrls() {
		return urls;
	}

	public void setUrls(String urls) {
		this.urls = urls;
	}

	public String getHashtag() {
		return hashtag;
	}

	public void setHashtag(String hashtag) {
		this.hashtag = hashtag;
	}

	public String getUser_mentions() {
		return user_mentions;
	}

	public void setUser_mentions(String user_mentions) {
		this.user_mentions = user_mentions;
	}

	public String getSymbols() {
		return symbols;
	}

	public void setSymbols(String symbols) {
		this.symbols = symbols;
	}

}
