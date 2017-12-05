package ressources;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.hibernate.Session;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import oauth.signpost.OAuthConsumer;
import oauth.signpost.commonshttp.CommonsHttpOAuthConsumer;
import oauth.signpost.exception.OAuthCommunicationException;
import oauth.signpost.exception.OAuthExpectationFailedException;
import oauth.signpost.exception.OAuthMessageSignerException;

public class TwitterBuilder {

	private String consumerKey;
	private String consumerSecret;
	private String accessToken;
	private String accessTokenSecret;

	public TwitterBuilder() throws IOException {
		super();
		Properties prop = new Properties();
		InputStream is = getClass().getResourceAsStream("/ressources/config.properties");

		// load a properties file
		System.out.println("ok");
		prop.load(is);
		System.out.println("ok");
		// get the property values
		consumerKey = prop.getProperty("consumerKey");
		consumerSecret = prop.getProperty("consumerSecret");
		accessToken = prop.getProperty("accessToken");
		accessTokenSecret = prop.getProperty("accessTokenSecret");
	}

	public JSONObject request(String url) throws UnsupportedOperationException, IOException,
			OAuthMessageSignerException, OAuthExpectationFailedException, OAuthCommunicationException, JSONException {
		OAuthConsumer oAuthConsumer = new CommonsHttpOAuthConsumer(consumerKey, consumerSecret);
		oAuthConsumer.setTokenWithSecret(accessToken, accessTokenSecret);

		// example url : https://api.twitter.com/1.1/statuses/home_timeline.json
		HttpGet httpGet = new HttpGet(url);

		oAuthConsumer.sign(httpGet);

		HttpClient httpClient = HttpClientBuilder.create().build();
		HttpResponse httpResponse = httpClient.execute(httpGet);

		int statusCode = httpResponse.getStatusLine().getStatusCode();
		BufferedReader reader = new BufferedReader(
				new InputStreamReader(httpResponse.getEntity().getContent(), "UTF-8"));
		StringBuilder builder = new StringBuilder();
		for (String line = null; (line = reader.readLine()) != null;) {
			// System.out.println(line);
			builder.append(line).append("\n");
		}
		JSONObject obj = new JSONObject(builder.toString());
		return obj;

	}

	public List<Map<String, Object>> getValues(JSONArray arr, ArrayList<String> path_list)
			throws NumberFormatException, JSONException {
		// json_values = new HashMap<String, Object>();
		int current_tweet_id = 0;
		List<Map<String, Object>> values = new ArrayList<Map<String, Object>>();
		Map<String, Object> json_values = new HashMap<String, Object>();
		for (String path : path_list) {
			String[] list = path.split("\\.");
			JSONObject current_tweet = (JSONObject) arr.get(Integer.parseInt(list[0]));
			JSONObject last_object = current_tweet;
			if (Integer.parseInt(list[0]) != current_tweet_id) {
				values.add(current_tweet_id, json_values);
				json_values = new HashMap<String, Object>();
				current_tweet_id = Integer.parseInt(list[0]);
			}
			for (int i = 1; i < list.length; i++) {
				try {
					last_object = last_object.getJSONObject(list[i]);
				} catch (JSONException e) {
					json_values.put(path, last_object.get(list[i]));
				}
			}
		}
		values.add(current_tweet_id, json_values);
		return values;
	}

	public void recurs_parsingJSON(JSONObject obj, JSONArray arr, String previous_key, ArrayList<String> all_path)
			throws JSONException {
		if (obj == null && arr == null) {
			all_path.add(previous_key);
		} else {
			if (obj != null) {
				// donable in a better way
				Iterator<String> keys = obj.keys();
				while (keys.hasNext()) {
					String next_key = keys.next();
					try {
						// try to cast it as an array
						JSONArray isArray = obj.getJSONArray(previous_key + "." + next_key);
						this.recurs_parsingJSON(null, isArray, previous_key + "." + next_key, null);
					} catch (JSONException jsonE) {
						try {
							this.recurs_parsingJSON(obj.getJSONObject(next_key), null, previous_key + "." + next_key,
									all_path);
						} catch (JSONException e) {
							this.recurs_parsingJSON(null, null, previous_key + "." + next_key, all_path);
						}
					}

				}
			} else if (arr != null) {
				for (int i = 0; i < arr.length(); i++) {
					JSONObject current_obj = arr.getJSONObject(i);
					Iterator<String> keys = current_obj.keys();
					while (keys.hasNext()) {
						String next_key = keys.next();
						try {
							// try to cast it as an array
							JSONArray isArray = current_obj.getJSONArray(previous_key + "." + next_key);
							this.recurs_parsingJSON(null, isArray, previous_key + "." + next_key, all_path);
						} catch (JSONException jsonE) {
							try {
								this.recurs_parsingJSON(current_obj.getJSONObject(next_key), null,
										previous_key + "." + next_key, all_path);
							} catch (JSONException e) {
								this.recurs_parsingJSON(null, null, previous_key + "." + next_key, all_path);
							}
						}

					}
				}
			}

		}

	}

	public List<Tweet> createTable(List<Map<String, Object>> values, Session session) {
		List<Tweet> listTweet = new ArrayList<Tweet>();
		for (int i = 0; i < values.size(); i++) {
			Entities e = new Entities();
			User u = new User();
			Tweet t = new Tweet();
			Object value = new Object();
			Map<String, Object> json_values = values.get(i);
			DateFormat format = new SimpleDateFormat("EEE MMM d hh:mm:ss ZZZZZ YYYY", Locale.ENGLISH);
			for (Map.Entry<String, Object> entry : json_values.entrySet()) {
				System.out.println("key : " + entry.getKey() + ", value : " + entry.getValue());
				// Method method = e.getClass()
				Method method;
				String[] list_entry = entry.getKey().split("\\.");
				// Determine from which type is the value
				if (entry.getValue() instanceof Boolean) {
					value = (Boolean) entry.getValue();
				} else if (entry.getValue() instanceof Integer) {
					System.out.println("integer");
					value = (int) entry.getValue();
				} else if (entry.getValue() instanceof String)
					try {
						value = (Date) format.parse((String) entry.getValue());
					} catch (ParseException e1) {
						// TODO Auto-generated catch block
						value = (String) entry.getValue();
					}
				try {
					switch (list_entry[1]) {
					case "user":
						method = u.getClass().getMethod("set" + StringUtils.capitalize(list_entry[2]),
								value.getClass());
						method.invoke(u, value);
						break;
					case "entities":
						method = e.getClass().getMethod("set" + StringUtils.capitalize(list_entry[2]),
								value.getClass());
						method.invoke(e, value);
						break;
					default:
						if (!list_entry[1].contains("retweeted_status")) {
							method = t.getClass().getMethod("set" + StringUtils.capitalize(list_entry[1]),
									value.getClass());
							method.invoke(t, value);
						}
						break;
					}
				} catch (Exception exc) {
					System.out.println(exc);
				}
			}
			// System.out.println("user for example : " + u.getDescription());
			t.setUser(u);
			t.setEntities(e);
			session.getTransaction().begin();
			session.save(u);
			session.save(e);
			session.save(t);
			session.getTransaction().commit();
			listTweet.add(t);
		}
		return listTweet;

	}

	public List<Tweet> queryAndCreate(String url, Session session) {
		ArrayList<String> path = new ArrayList<String>();
		List<Map<String, Object>> values = new ArrayList<Map<String, Object>>();
		try {
			JSONObject result = this.request(url);
			JSONArray statuses = result.getJSONArray("statuses");
			for (int i = 0; i < statuses.length(); i++) {
				JSONObject current_obj = statuses.getJSONObject(i);
				this.recurs_parsingJSON(current_obj, null, Integer.toString(i), path);
			}
			values = this.getValues(statuses, path);
		} catch (Exception e) {
			// TODO
			System.out.println(e);
		}
		return this.createTable(values, session);
	}

	public static void main(String[] args) {
		try {
			ArrayList<String> path = new ArrayList<String>();
			Session session = SFactory.getSession();
			List<Map<String, Object>> values = new ArrayList<Map<String, Object>>();
			TwitterBuilder twitterBuilder = new TwitterBuilder();
			String url = "https://api.twitter.com/1.1/search/tweets.json?q=tugraz";
			JSONObject result = twitterBuilder.request(url);
			JSONArray statuses = result.getJSONArray("statuses");
			for (int i = 0; i < statuses.length(); i++) {
				JSONObject current_obj = statuses.getJSONObject(i);
				twitterBuilder.recurs_parsingJSON(current_obj, null, Integer.toString(i), path);
			}
			values = twitterBuilder.getValues(statuses, path);
			twitterBuilder.createTable(values, session);
			session.close();
		} catch (Exception e) {
			System.out.println(e);
		}
	}

}
