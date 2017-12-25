package ressources;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@javax.persistence.Entity
@Table(name = "entities")
public class Entities {
	/**
	 * 
	 * Object representating the entities field in Tweets object
	 * 
	 * @param urls Field of entities in the tweets
	 * @param hashtag Field of hashtag in the tweets
	 * @param user_mentions Field of users_mentions in the tweets
	 * @param symbols Field of symbols in the tweets
	 */
	
	public Entities(String urls, String hashtag, String user_mentions, String symbols) {
		super();
		this.urls = urls;
		this.hashtag = hashtag;
		this.user_mentions = user_mentions;
		this.symbols = symbols;
	}
	
	public Entities() {}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;
	
	@Column(name = "urls")
	private String urls;
	
	@Column(name = "hashtag")
	private String hashtag;
	
	@Column(name = "user_mentions")
	private String user_mentions;
	
	@Column(name = "symbols")
	private String symbols;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
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
