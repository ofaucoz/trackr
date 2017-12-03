package ressources;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.Session;

@javax.persistence.Entity
@Table(name = "tweet")
public class Tweet {
	
	
	public Tweet(String in_reply_to_status_id_str, String in_reply_to_status_id, Date created_at, String source,
			int retweet_count, String retweeted, String geo, String in_reply_to_screen_name, String is_quote_status,
			int favorite_count, int tweet_id, String tweet_text, String place, String lang, boolean favorited,
			boolean possibly_sensitive, String coordinates, boolean truncated, String contributors, User user) {
		super();
		this.in_reply_to_status_id_str = in_reply_to_status_id_str;
		this.in_reply_to_status_id = in_reply_to_status_id;
		this.created_at = created_at;
		this.source = source;
		this.retweet_count = retweet_count;
		this.retweeted = retweeted;
		this.geo = geo;
		this.in_reply_to_screen_name = in_reply_to_screen_name;
		this.is_quote_status = is_quote_status;
		this.favorite_count = favorite_count;
		this.tweet_id = tweet_id;
		this.tweet_text = tweet_text;
		this.place = place;
		this.lang = lang;
		this.favorited = favorited;
		this.possibly_sensitive = possibly_sensitive;
		this.coordinates = coordinates;
		this.truncated = truncated;
		this.contributors = contributors;
		this.user = user;
	}

	@Column(name = "in_reply_to_status_id_str")
	private String in_reply_to_status_id_str;

	@Column(name = "in_reply_to_status_id")
	private String in_reply_to_status_id;

	@Column(name = "created_at", columnDefinition = "DATETIME")
	@Temporal(TemporalType.TIMESTAMP)
	private Date created_at;

	@Column(name = "source")
	private String source;

	@Column(name = "retweet_count")
	private int retweet_count;

	@Column(name = "retweeted")
	private String retweeted;

	@Column(name = "geo")
	private String geo;

	@Column(name = "in_reply_to_screen_name")
	private String in_reply_to_screen_name;

	@Column(name = "is_quote_status")
	private String is_quote_status;

	@Column(name = "favorite_count")
	private int favorite_count;

	@Column(name = "tweet_id")
	private int tweet_id;

	@Column(name = "tweet_text")
	private String tweet_text;

	@Column(name = "place")
	private String place;

	@Column(name = "lang")
	private String lang;

	@Column(name = "favorited")
	private boolean favorited;

	@Column(name = "possibly_sensitive")
	private boolean possibly_sensitive;

	@Column(name = "coordinates")
	private String coordinates;

	@Column(name = "truncated")
	private boolean truncated;

	@Column(name = "contributors")
	private String contributors;

	@OneToOne
	@JoinColumn(name = "user")
	private User user;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private int id;

	public String getIn_reply_to_status_id_str() {
		return in_reply_to_status_id_str;
	}

	public void setIn_reply_to_status_id_str(String in_reply_to_status_id_str) {
		this.in_reply_to_status_id_str = in_reply_to_status_id_str;
	}

	public String getIn_reply_to_status_id() {
		return in_reply_to_status_id;
	}

	public void setIn_reply_to_status_id(String in_reply_to_status_id) {
		this.in_reply_to_status_id = in_reply_to_status_id;
	}

	public Date getCreated_at() {
		return created_at;
	}

	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public int getRetweet_count() {
		return retweet_count;
	}

	public void setRetweet_count(int retweet_count) {
		this.retweet_count = retweet_count;
	}

	public String getRetweeted() {
		return retweeted;
	}

	public void setRetweeted(String retweeted) {
		this.retweeted = retweeted;
	}

	public String getGeo() {
		return geo;
	}

	public void setGeo(String geo) {
		this.geo = geo;
	}

	public String getIn_reply_to_screen_name() {
		return in_reply_to_screen_name;
	}

	public void setIn_reply_to_screen_name(String in_reply_to_screen_name) {
		this.in_reply_to_screen_name = in_reply_to_screen_name;
	}

	public String getIs_quote_status() {
		return is_quote_status;
	}

	public void setIs_quote_status(String is_quote_status) {
		this.is_quote_status = is_quote_status;
	}

	public int getFavorite_count() {
		return favorite_count;
	}

	public void setFavorite_count(int favorite_count) {
		this.favorite_count = favorite_count;
	}

	public int getTweet_id() {
		return tweet_id;
	}

	public void setTweet_id(int tweet_id) {
		this.tweet_id = tweet_id;
	}

	public String getTweet_text() {
		return tweet_text;
	}

	public void setTweet_text(String tweet_text) {
		this.tweet_text = tweet_text;
	}

	public String getPlace() {
		return place;
	}

	public void setPlace(String place) {
		this.place = place;
	}

	public String getLang() {
		return lang;
	}

	public void setLang(String lang) {
		this.lang = lang;
	}

	public boolean isFavorited() {
		return favorited;
	}

	public void setFavorited(boolean favorited) {
		this.favorited = favorited;
	}

	public boolean isPossibly_sensitive() {
		return possibly_sensitive;
	}

	public void setPossibly_sensitive(boolean possibly_sensitive) {
		this.possibly_sensitive = possibly_sensitive;
	}

	public String getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(String coordinates) {
		this.coordinates = coordinates;
	}

	public boolean isTruncated() {
		return truncated;
	}

	public void setTruncated(boolean truncated) {
		this.truncated = truncated;
	}

	public String getContributors() {
		return contributors;
	}

	public void setContributors(String contributors) {
		this.contributors = contributors;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	

	public static void main(String[] args) {
		Session session = SFactory.getSession();
		
		Entities e = new Entities("test", "test", "test", "test");
		User u = new User(0, 2, "test",2,"test",true,2,"test",new Date(2013,12,1,1,1), true, "test", true, "test", "test", true,
				"test", "test", true,"test", "test", true, "test","test", "test", true, "test","test", e, 2, true,2, true, true, true,
				"test", "test", "test", true);
		Tweet t = new Tweet("test", "test", new Date(2013,12,1,1,1), "test",2, "test", "test", "test","test",4, 2, "test", "test", "test", true,
				true, "test", true, "test", u);
		session.beginTransaction();
		session.saveOrUpdate(e);
		session.saveOrUpdate(u);
		session.saveOrUpdate(t);
		session.getTransaction().commit();
		System.out.println(t.getFavorite_count());
		session.close();
}

}
