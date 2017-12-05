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
			Integer retweet_count, String retweeted, String geo, String in_reply_to_screen_name, String is_quote_status,
			Integer favorite_count, Integer tweet_id, String tweet_text, String place, String lang, Boolean favorited,
			Boolean possibly_sensitive, String coordinates, Boolean truncated, String contributors, User user, Entities entities) {
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
		this.text = tweet_text;
		this.place = place;
		this.lang = lang;
		this.favorited = favorited;
		this.possibly_sensitive = possibly_sensitive;
		this.coordinates = coordinates;
		this.truncated = truncated;
		this.contributors = contributors;
		this.user = user;
		this.entities = entities;
	}
	
	public Tweet() {}

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
	private Integer retweet_count;

	@Column(name = "retweeted")
	private String retweeted;

	@Column(name = "geo")
	private String geo;

	@Column(name = "in_reply_to_screen_name")
	private String in_reply_to_screen_name;

	@Column(name = "is_quote_status")
	private String is_quote_status;

	@Column(name = "favorite_count")
	private Integer favorite_count;

	@Column(name = "tweet_id")
	private Integer tweet_id;

	@Column(name = "tweet_text")
	private String text;

	@Column(name = "place")
	private String place;

	@Column(name = "lang")
	private String lang;

	@Column(name = "favorited")
	private Boolean favorited;

	@Column(name = "possibly_sensitive")
	private Boolean possibly_sensitive;

	@Column(name = "coordinates")
	private String coordinates;

	@Column(name = "truncated")
	private Boolean truncated;

	@Column(name = "contributors")
	private String contributors;

	@OneToOne
	@JoinColumn(name = "user")
	private User user;	

	@OneToOne
	@JoinColumn(name = "entities")
	private Entities entities;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private Integer id;

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

	public Integer getRetweet_count() {
		return retweet_count;
	}

	public void setRetweet_count(Integer retweet_count) {
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

	public Integer getFavorite_count() {
		return favorite_count;
	}

	public void setFavorite_count(Integer favorite_count) {
		this.favorite_count = favorite_count;
	}

	public Integer getTweet_id() {
		return tweet_id;
	}

	public void setTweet_id(Integer tweet_id) {
		this.tweet_id = tweet_id;
	}

	public String getText() {
		return text;
	}

	public void setText(String tweet_text) {
		this.text = tweet_text;
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

	public Boolean isFavorited() {
		return favorited;
	}

	public void setFavorited(Boolean favorited) {
		this.favorited = favorited;
	}

	public Boolean isPossibly_sensitive() {
		return possibly_sensitive;
	}

	public void setPossibly_sensitive(Boolean possibly_sensitive) {
		this.possibly_sensitive = possibly_sensitive;
	}

	public String getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(String coordinates) {
		this.coordinates = coordinates;
	}

	public Boolean isTruncated() {
		return truncated;
	}

	public void setTruncated(Boolean truncated) {
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

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	
	public Entities getEntities() {
		return entities;
	}

	public void setEntities(Entities entities) {
		this.entities = entities;
	}
	

	public static void main(String[] args) {
		Session session = SFactory.getSession();		
		Entities e = new Entities("test", "test", "test", "test");
		User u = new User(0, 2, "test",2,"test",true,2,"test",new Date(2013,12,1,1,1), true, "test", true, "test", "test", true,
				"test", "test", true,"test", "test", true, "test","test", "test", true, "test","test", 2, true,2, true, true, true,
				"test", "test", "test", true);
		Tweet t = new Tweet("test", "test", new Date(2013,12,1,1,1), "test",2, "test", "test", "test","test",4, 2, "test", "test", "test", true,
				true, "test", true, "test", u, e);
		session.beginTransaction();
		session.saveOrUpdate(e);
		session.saveOrUpdate(u);
		session.saveOrUpdate(t);
		session.getTransaction().commit();
		System.out.println(t.getFavorite_count());
		session.close();
}


}
